// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔐 Your Firebase config (replace with your own)
  const firebaseConfig = {
    apiKey: "AIzaSyB77nJbhd2jcOrPSs9kM7mhBJhVX40F9mA",
    authDomain: "aswed-2d60f.firebaseapp.com",
    projectId: "aswed-2d60f",
    storageBucket: "aswed-2d60f.firebasestorage.app",
    messagingSenderId: "200170967490",
    appId: "1:200170967490:web:962f3b12b6ced85caa465b",
    measurementId: "G-3F489GKLHK"
  };

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EXPORT FUNCTIONS
export async function signup(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}

export { auth };