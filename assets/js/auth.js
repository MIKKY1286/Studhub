import {
  signup,
  login,
  signInWithGoogle,
  signInWithGithub,
  logout
} from "./firebase.js";


// EMAILJS INIT
emailjs.init("kB2hGEEEYAYTlYaKb");


// ========================
// SIGNUP
// ========================

const signupForm =
document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
    document.getElementById("name").value.trim();

    const email =
    signupForm.querySelector(
      'input[type="email"]'
    ).value.trim();

    const password =
    signupForm.querySelector(
      "#password"
    ).value.trim();

    if (!name || !email || !password) {

      Swal.fire(
        "Error",
        "Please fill all fields",
        "error"
      );

      return;

    }

    try {

      // GENERATE OTP
      const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // OTP EXPIRY
      const expiry =
      Date.now() + (5 * 60 * 1000);

      // STORE TEMP DATA
      localStorage.setItem("otp", otp);

      localStorage.setItem(
        "otpExpiry",
        expiry
      );

      localStorage.setItem(
        "tempName",
        name
      );

      localStorage.setItem(
        "tempEmail",
        email
      );

      localStorage.setItem(
        "tempPassword",
        password
      );

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

      Swal.fire(
        "OTP Sent",
        "Check your email for verification code",
        "success"
      ).then(() => {

        window.location.href =
        "../verify.html";

      });

    }

    catch (err) {

      Swal.fire(
        "Error",
        err.message,
        "error"
      );

    }

  });

}


// ========================
// VERIFY OTP
// ========================

const verifyBtn =
document.getElementById("verifyBtn");

if (verifyBtn) {

  verifyBtn.addEventListener("click", async () => {

    const enteredOtp =
    document.getElementById("otpInput")
    .value.trim();

    const storedOtp =
    localStorage.getItem("otp");

    const expiry =
    localStorage.getItem("otpExpiry");

    // CHECK EXPIRY
    if (Date.now() > Number(expiry)) {

      Swal.fire(
        "Expired",
        "OTP has expired",
        "error"
      );

      return;

    }

    // CHECK OTP
    if (enteredOtp !== storedOtp) {

      Swal.fire(
        "Invalid OTP",
        "Please check the code again",
        "error"
      );

      return;

    }

    const name =
    localStorage.getItem("tempName");

    const email =
    localStorage.getItem("tempEmail");

    const password =
    localStorage.getItem("tempPassword");

    try {

      await signup(
        name,
        email,
        password
      );

      // CLEAR STORAGE
      localStorage.removeItem("otp");

      localStorage.removeItem("otpExpiry");

      localStorage.removeItem("tempName");

      localStorage.removeItem("tempEmail");

      localStorage.removeItem("tempPassword");

      Swal.fire(
        "Success",
        "Account created successfully",
        "success"
      ).then(() => {

        window.location.href =
        "../login.html";

      });

    }

    catch (err) {

      Swal.fire(
        "Error",
        err.message,
        "error"
      );

    }

  });

}


// ========================
// RESEND OTP
// ========================

const resendBtn =
document.getElementById("resendOtp");

if (resendBtn) {

  resendBtn.addEventListener("click", async () => {

    const email =
    localStorage.getItem("tempEmail");

    const name =
    localStorage.getItem("tempName");

    if (!email) {

      Swal.fire(
        "Error",
        "Signup session expired",
        "error"
      );

      return;

    }

    try {

      const newOtp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const expiry =
      Date.now() + (5 * 60 * 1000);

      localStorage.setItem(
        "otp",
        newOtp
      );

      localStorage.setItem(
        "otpExpiry",
        expiry
      );

      await emailjs.send(
        "service_ap0twre",
        "template_he9wyin",
        {
          to_email: email,
          otp: newOtp,
          user_name: name
        }
      );

      Swal.fire(
        "Success",
        "New OTP sent",
        "success"
      );

    }

    catch (err) {

      Swal.fire(
        "Error",
        err.message,
        "error"
      );

    }

  });

}


// ========================
// LOGIN
// ========================

const loginForm =
document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    loginForm.querySelector(
      'input[type="email"]'
    ).value.trim();

    const password =
    loginForm.querySelector(
      "#password"
    ).value.trim();

    try {

      await login(
        email,
        password
      );

      Swal.fire(
        "Success",
        "Login successful",
        "success"
      ).then(() => {

        window.location.href =
        "../dashboard.html";

      });

    }

    catch (err) {

      Swal.fire(
        "Error",
        err.message,
        "error"
      );

    }

  });

}


// ========================
// GOOGLE SIGNUP / LOGIN
// ========================

document.getElementById("googleSignup")
.addEventListener("click", async () => {

  try{

    const provider =
    new GoogleAuthProvider();

    await signInWithRedirect(
      auth,
      provider
    );

  }

  catch(error){

    console.error(error);

    Swal.fire(
      "Error",
      error.message,
      "error"
    );

  }

});


// ========================
// GITHUB SIGNUP / LOGIN
// ========================

document.getElementById("githubSignup")
.addEventListener("click", async () => {

  try{

    const provider =
    new GithubAuthProvider();

    await signInWithRedirect(
      auth,
      provider
    );

  }

  catch(error){

    console.error(error);

    Swal.fire(
      "Error",
      error.message,
      "error"
    );

  }

});


// ========================
// LOGOUT
// ========================

const logoutBtn =
document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {

    try {

      await logout();

      Swal.fire(
        "Logged Out",
        "You have been logged out",
        "success"
      ).then(() => {

        window.location.href =
        "../login.html";

      });

    }

    catch (err) {

      Swal.fire(
        "Error",
        err.message,
        "error"
      );

    }

  };

}