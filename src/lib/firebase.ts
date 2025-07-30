import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "ethereal-writings",
  appId: "1:205547947082:web:e2bf457f723475fb5052b3",
  storageBucket: "ethereal-writings.firebasestorage.app",
  apiKey: "AIzaSyC8VklGlxKdlufnCwxD3Y0E73wySGKJLX4",
  authDomain: "ethereal-writings.firebaseapp.com",
  messagingSenderId: "205547947082",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
