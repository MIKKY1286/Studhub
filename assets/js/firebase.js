import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// 🔐 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB77nJbhd2jcOrPSs9kM7mhBJhVX40F9mA",
  authDomain: "aswed-2d60f.firebaseapp.com",
  projectId: "aswed-2d60f",
  storageBucket: "aswed-2d60f.firebasestorage.app",
  messagingSenderId: "200170967490",
  appId: "1:200170967490:web:962f3b12b6ced85caa465b",
  measurementId: "G-3F489GKLHK"
};


// 🚀 INIT
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// 🧠 CREATE USER (SAFE + NO DUPLICATES OVERWRITE)
export async function signup(name, email, password){

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // set display name
  await updateProfile(user, {
    displayName: name
  });

  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  // only create if not exists (prevents overwrite bugs)
  if(!existing.exists()){

    await setDoc(userRef, {
      uid: user.uid,
      name,
      email,
      role: "student",
      provider: "email",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

  } else {

    // update login time only
    await setDoc(userRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });

  }

  return userCredential; // IMPORTANT FIX FOR YOUR OTP FLOW
}


// 🔐 LOGIN
export async function login(email, password){

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // update login timestamp
  await setDoc(doc(db, "users", user.uid), {
    lastLogin: serverTimestamp()
  }, { merge: true });

  return userCredential;
}


// 🔁 RESET PASSWORD
export async function resetPassword(email){
  return await sendPasswordResetEmail(auth, email);
}


// 🚪 LOGOUT
export async function logout(){
  return await signOut(auth);
}