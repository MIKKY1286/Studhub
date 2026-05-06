import { signup } from "./firebase.js";

const inputs = document.querySelectorAll(".otp-box");
const verifyBtn = document.getElementById("verifyBtn");
const resendBtn = document.getElementById("resendOtp");
const timerEl = document.getElementById("timer");

let cooldown = 0;
let isVerifying = false;

//
// INPUT BEHAVIOR
//
inputs.forEach((input, index) => {

  input.addEventListener("input", () => {

    input.value = input.value.replace(/[^0-9]/g, "");

    if(input.value && index < inputs.length - 1){
      inputs[index + 1].focus();
    }

    autoSubmitOTP();

  });

  input.addEventListener("keydown", (e) => {

    if(e.key === "Backspace" && !input.value && index > 0){
      inputs[index - 1].focus();
    }

  });

});

function getOTP(){
  return Array.from(inputs).map(i => i.value).join("");
}

//
// SHAKE EFFECT
//
function shake(){
  const box = document.getElementById("otpContainer");

  box.classList.add("shake");

  setTimeout(() => {
    box.classList.remove("shake");
  }, 400);
}

//
// VERIFY OTP CORE
//
async function verifyOTP(otp){

  if(isVerifying) return;

  isVerifying = true;

  const savedOtp = localStorage.getItem("otp");
  const expiry = localStorage.getItem("otpExpiry");

  if(!savedOtp || !expiry){
    Swal.fire("Error", "OTP not found", "error");
    isVerifying = false;
    return;
  }

  if(Date.now() > Number(expiry)){
    Swal.fire("Expired", "OTP has expired", "error");
    isVerifying = false;
    return;
  }

  if(otp !== savedOtp){
    shake();
    Swal.fire("Invalid", "Wrong OTP", "error");
    isVerifying = false;
    return;
  }

  const name = localStorage.getItem("tempName");
  const email = localStorage.getItem("tempEmail");
  const password = localStorage.getItem("tempPassword");

  try {

    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<div class="loader"></div>`;

    const result = await signup(name, email, password);

    if(!result || !result.user){
      throw new Error("Signup failed");
    }

    localStorage.clear();

    Swal.fire("Success", "Account created", "success")
    .then(() => {
      window.location.href = "dashboard.html";
    });

  } catch(err){

    Swal.fire("Error", err.message, "error");

  } finally {

    isVerifying = false;

    verifyBtn.disabled = false;
    verifyBtn.innerHTML = "Verify";

  }

}

//
// AUTO SUBMIT (SAFE VERSION)
//
function autoSubmitOTP(){

  const otp = getOTP();

  if(otp.length === 6 && !isVerifying){
    verifyOTP(otp);
  }

}

//
// BUTTON VERIFY
//
verifyBtn.addEventListener("click", () => {
  verifyOTP(getOTP());
});

//
// RESEND TIMER
//
function startCooldown(){

  cooldown = 30;

  const interval = setInterval(() => {

    cooldown--;
    timerEl.innerText = `(${cooldown}s)`;

    if(cooldown <= 0){
      clearInterval(interval);
      timerEl.innerText = "";
    }

  }, 1000);

}

//
// RESEND OTP
//
resendBtn.addEventListener("click", async () => {

  if(cooldown > 0) return;

  const email = localStorage.getItem("tempEmail");

  if(!email){
    Swal.fire("Error", "No email found", "error");
    return;
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000);
  const expiry = Date.now() + (5 * 60 * 1000);

  localStorage.setItem("otp", newOtp);
  localStorage.setItem("otpExpiry", expiry);

  try {

    await emailjs.send("service_ap0twre", "template_he9wyin", {
      to_email: email,
      otp: newOtp
    });

    Swal.fire("Sent", "New OTP sent", "success");

    startCooldown();

  } catch(err){

    Swal.fire("Error", err.message, "error");

  }

});