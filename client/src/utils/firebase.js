import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "prppilot.firebaseapp.com",
  projectId: "prppilot",
  storageBucket: "prppilot.firebasestorage.app",
  messagingSenderId: "313333409058",
  appId: "1:313333409058:web:104d6bde67ef702f3f317b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
