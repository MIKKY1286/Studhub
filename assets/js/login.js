// CORE AUTH ONLY FROM FIREBASE FILE
import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";


// PROVIDERS (FIX FOR YOUR ERROR)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


// ELEMENTS
const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");
const rememberMe = document.getElementById("rememberMe");

let isLoading = false;


// LOADING STATE
function setLoading(state){

  isLoading = state;

  btn.disabled = state;

  btnText.innerHTML = state
    ? `<div class="loader"></div>`
    : "Login";

}


// ERROR MESSAGES
function getErrorMessage(code){

  switch(code){

    case "auth/user-not-found":
      return "No account found with this email";

    case "auth/wrong-password":
      return "Incorrect password";

    case "auth/invalid-email":
      return "Invalid email address";

    case "auth/too-many-requests":
      return "Too many attempts. Try again later";

    default:
      return "Login failed. Please try again";

  }

}


// REDIRECT
function goDashboard(){
  setTimeout(() => {
    window.location.href = "../dashboard.html";
  }, 1200);
}


// EMAIL LOGIN
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  if(isLoading) return;

  setLoading(true);

  try {

    await setPersistence(
      auth,
      rememberMe.checked
        ? browserLocalPersistence
        : browserSessionPersistence
    );

    await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value.trim()
    );

    Swal.fire({
      icon: "success",
      title: "Login successful",
      text: "Welcome back",
      timer: 1200,
      showConfirmButton: false
    });

    goDashboard();

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Login failed",
      text: getErrorMessage(error.code)
    });

  } finally {

    setLoading(false);

  }

});


// GOOGLE LOGIN
document.getElementById("googleLogin")
.addEventListener("click", async () => {

  if(isLoading) return;

  setLoading(true);

  try {

    await signInWithPopup(auth, googleProvider);

    Swal.fire({
      icon: "success",
      title: "Google login successful",
      timer: 1200,
      showConfirmButton: false
    });

    goDashboard();

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Google login failed",
      text: error.message
    });

  } finally {

    setLoading(false);

  }

});


// GITHUB LOGIN
document.getElementById("githubLogin")
.addEventListener("click", async () => {

  if(isLoading) return;

  setLoading(true);

  try {

    await signInWithPopup(auth, githubProvider);

    Swal.fire({
      icon: "success",
      title: "GitHub login successful",
      timer: 1200,
      showConfirmButton: false
    });

    goDashboard();

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "GitHub login failed",
      text: error.message
    });

  } finally {

    setLoading(false);

  }

});