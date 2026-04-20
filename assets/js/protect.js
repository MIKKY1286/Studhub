// js/protect.js

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

import { logout } from "./firebase.js";

document.getElementById("logoutBtn").onclick = async () => {
  await logout();
  window.location.href = "login.html";
};