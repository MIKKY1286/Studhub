import { auth, db } from "./firebase.js";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// EMAILJS INIT
emailjs.init("kB2hGEEEYAYTlYaKb");


// ELEMENTS
const form = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const btnText = document.getElementById("btnText");
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");


// PASSWORD TOGGLE
document.getElementById("togglePassword").addEventListener("click", () => {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
});


// PASSWORD STRENGTH
passwordInput.addEventListener("input", () => {

  const value = passwordInput.value;
  let strength = 0;

  if (value.length >= 6) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;

  if (strength === 1) {
    strengthBar.style.width = "25%";
    strengthBar.className = "h-full bg-red-500";
    strengthText.innerText = "Weak Password";
  }
  else if (strength === 2) {
    strengthBar.style.width = "50%";
    strengthBar.className = "h-full bg-yellow-500";
    strengthText.innerText = "Medium Password";
  }
  else if (strength === 3) {
    strengthBar.style.width = "75%";
    strengthBar.className = "h-full bg-blue-500";
    strengthText.innerText = "Strong Password";
  }
  else if (strength === 4) {
    strengthBar.style.width = "100%";
    strengthBar.className = "h-full bg-green-500";
    strengthText.innerText = "Very Strong Password";
  }
  else {
    strengthBar.style.width = "0%";
    strengthText.innerText = "";
  }

});


// 🔐 CREATE USER IF NOT EXISTS
async function createUserIfNotExists(user, provider) {

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {

    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email || "",
      photo: user.photoURL || "",
      provider: provider,
      role: "student",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

  } else {

    await setDoc(userRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });

  }

}


// EMAIL SIGNUP WITH OTP + EXPIRY
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    Swal.fire("Missing Fields", "Please complete all fields", "warning");
    return;
  }

  signupBtn.disabled = true;
  btnText.innerHTML = `<div class="loader"></div>`;

  try {

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // SET EXPIRY (5 MINUTES)
    const expiryTime = Date.now() + (5 * 60 * 1000);

    // STORE TEMP DATA
    localStorage.setItem("otp", otp);
    localStorage.setItem("otpExpiry", expiryTime);

    localStorage.setItem("tempName", name);
    localStorage.setItem("tempEmail", email);
    localStorage.setItem("tempPassword", password);

    // SEND EMAIL
    await emailjs.send(
      "service_ap0twre",
      "template_he9wyin",
      {
        to_email: email,
        otp: otp,
        user_name: name
      }
    );

    Swal.fire({
      icon: "success",
      title: "OTP Sent",
      text: "Check your email (valid for 5 minutes)"
    }).then(() => {
      window.location.href = "verify.html";
    });

  } catch (error) {

    Swal.fire("Error", error.message, "error");

  } finally {

    signupBtn.disabled = false;
    btnText.innerHTML = "Create Account";

  }

});


// GOOGLE SIGNUP
document.getElementById("googleSignup")
.addEventListener("click", async () => {

  try {

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    await createUserIfNotExists(result.user, "google");

    Swal.fire({
      icon: "success",
      title: "Google Sign Up Successful",
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {

    Swal.fire("Error", error.message, "error");

  }

});


// GITHUB SIGNUP
document.getElementById("githubSignup")
.addEventListener("click", async () => {

  try {

    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);

    await createUserIfNotExists(result.user, "github");

    Swal.fire({
      icon: "success",
      title: "GitHub Sign Up Successful",
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (error) {

    Swal.fire("Error", error.message, "error");

  }

});