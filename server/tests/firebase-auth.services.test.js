import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import { verifyFirebaseIdentity } from "../services/firebase-auth.services.js"

const originalFetch = globalThis.fetch
const originalApiKey = process.env.FIREBASE_API_KEY

afterEach(() => {
    globalThis.fetch = originalFetch
    if (originalApiKey === undefined) {
        delete process.env.FIREBASE_API_KEY
    } else {
        process.env.FIREBASE_API_KEY = originalApiKey
    }
})

test("verifies and returns a Google identity from a Firebase ID token", async () => {
    process.env.FIREBASE_API_KEY = "test-web-api-key"
    globalThis.fetch = async (url, options) => {
        assert.match(url, /accounts:lookup\?key=test-web-api-key$/)
        assert.equal(options.method, "POST")
        assert.equal(JSON.parse(options.body).idToken, "firebase-id-token")
        return new Response(JSON.stringify({
            users: [{
                localId: "firebase-user-id",
                email: "student@example.test",
                emailVerified: true,
                displayName: "Prep Student",
                providerUserInfo: [{ providerId: "google.com" }]
            }]
        }), { status: 200 })
    }

    assert.deepEqual(await verifyFirebaseIdentity("firebase-id-token"), {
        name: "Prep Student",
        email: "student@example.test"
    })
})

test("rejects an invalid Firebase ID token", async () => {
    process.env.FIREBASE_API_KEY = "test-web-api-key"
    globalThis.fetch = async () => new Response(
        JSON.stringify({ error: { message: "INVALID_ID_TOKEN" } }),
        { status: 400 }
    )

    assert.equal(await verifyFirebaseIdentity("invalid-token"), null)
})

test("rejects an identity without a verified Google provider", async () => {
    process.env.FIREBASE_API_KEY = "test-web-api-key"
    globalThis.fetch = async () => new Response(JSON.stringify({
        users: [{
            localId: "firebase-user-id",
            email: "student@example.test",
            emailVerified: true,
            providerUserInfo: [{ providerId: "password" }]
        }]
    }), { status: 200 })

    assert.equal(await verifyFirebaseIdentity("firebase-id-token"), null)
})

test("requires Firebase configuration on the server", async () => {
    delete process.env.FIREBASE_API_KEY
    await assert.rejects(verifyFirebaseIdentity("firebase-id-token"), /FIREBASE_API_KEY/)
})
