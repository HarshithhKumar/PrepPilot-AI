const FIREBASE_LOOKUP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup"

export const verifyFirebaseIdentity = async (idToken) => {
    if (!process.env.FIREBASE_API_KEY) {
        throw new Error("FIREBASE_API_KEY must be configured on the server")
    }

    const response = await fetch(
        `${FIREBASE_LOOKUP_URL}?key=${encodeURIComponent(process.env.FIREBASE_API_KEY)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
        }
    )
    const data = await response.json()

    if (!response.ok) {
        const firebaseError = data.error?.message
        if (response.status === 400 &&
            ["INVALID_ID_TOKEN", "USER_NOT_FOUND", "TOKEN_EXPIRED"].some(
                (code) => firebaseError?.includes(code)
            )) {
            return null
        }
        throw new Error("Firebase identity verification failed")
    }

    const user = data.users?.[0]
    const isGoogleAccount = user?.providerUserInfo?.some(
        (provider) => provider.providerId === "google.com"
    )

    if (!user?.localId || !user.email || !user.emailVerified || !isGoogleAccount) {
        return null
    }

    return {
        name: user.displayName?.trim() || user.email,
        email: user.email.toLowerCase()
    }
}
