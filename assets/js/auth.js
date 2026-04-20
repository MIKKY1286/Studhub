import { signup } from "./firebase.js";

const form = document.getElementById("signupForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('#password').value;

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
      // store OTP temporarily
      localStorage.setItem("otp", otp);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      // send email
      await emailjs.send("service_ap0twre", "template_he9wyin", {
        to_email: email,
        otp: otp
      });

      Swal.fire("OTP Sent", "Check your email for verification code", "success")
      .then(() => {
        window.location.href = "../verify.html";
      });

    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await logout();
    window.location.href = "../login.html";
  };
}