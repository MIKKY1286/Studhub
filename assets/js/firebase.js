import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB77nJbhd2jcOrPSs9kM7mhBJhVX40F9mA",
  authDomain: "aswed-2d60f.firebaseapp.com",
  projectId: "aswed-2d60f",
  storageBucket: "aswed-2d60f.firebasestorage.app",
  messagingSenderId: "200170967490",
  appId: "1:200170967490:web:962f3b12b6ced85caa465b",
  measurementId: "G-3F489GKLHK"
};


// INIT
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);


// GOOGLE PROVIDER
const googleProvider = new GoogleAuthProvider();


// GITHUB PROVIDER
const githubProvider = new GithubAuthProvider();


// SIGNUP
export async function signup(name, email, password){

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name
  });

  await setDoc(doc(db, "users", user.uid), {

    uid: user.uid,

    name: name,

    email: email,

    provider: "email",

    createdAt: serverTimestamp()

  });

  return user;

}


// LOGIN
export async function login(email, password){

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;

}


// GOOGLE LOGIN
export async function signInWithGoogle(){

  const result =
    await signInWithPopup(
      auth,
      googleProvider
    );

  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {

      uid: user.uid,

      name: user.displayName,

      email: user.email,

      photo: user.photoURL,

      provider: "google",

      createdAt: serverTimestamp()

    },
    { merge: true }
  );

  return user;

}


// GITHUB LOGIN
export async function signInWithGithub(){

  const result =
    await signInWithPopup(
      auth,
      githubProvider
    );

  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {

      uid: user.uid,

      name: user.displayName || "GitHub User",

      email: user.email,

      photo: user.photoURL,

      provider: "github",

      createdAt: serverTimestamp()

    },
    { merge: true }
  );

  return user;

}


// RESET PASSWORD
export async function resetPassword(email){

  return await sendPasswordResetEmail(
    auth,
    email
  );

}


// LOGOUT
export async function logout(){

  return await signOut(auth);

}
