// ================= ELEMENTS =================
const loginBtn = document.getElementById('loginBtn');
const verifyBtn = document.getElementById('verifyBtn');
const resendOtp = document.getElementById('resendOtp');
const mobileInput = document.getElementById('mobile');

const otpScreen = document.getElementById('otp-screen');
const loginScreen = document.getElementById('login-screen');
const formScreen = document.getElementById('form-screen');
const choiceScreen = document.getElementById('choice-screen');

const otpMobileText = document.getElementById('otpMobile');
const proceedBtn = document.getElementById('proceedBtn');

// ================= COMMON FUNCTIONS =================
function showElement(el) {
  if (!el) return;
  el.classList.remove('hidden');
  el.classList.add('fade-in');
}

function hideElement(el) {
  if (!el) return;
  el.classList.add('hidden');
  el.classList.remove('fade-in');
}

// ================= GO TO LANDING (NEW PAGE) =================
function goToLanding() {
  window.location.href = "landing.html";
}

// ================= LOGIN → OTP =================
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const mobile = mobileInput.value.replace(/\D/g, '');

    if (mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      mobileInput.focus();
      return;
    }

    otpMobileText.textContent = `+91 ${mobile}`;
    hideElement(loginScreen);
    showElement(otpScreen);
  });
}

// ================= OTP → FORM =================
if (verifyBtn) {
  verifyBtn.addEventListener('click', () => {
    const otp = Array.from(document.querySelectorAll('.otp-input'))
      .map(i => i.value)
      .join('');

    if (otp.length !== 4) {
      alert('Enter valid OTP');
      return;
    }

    hideElement(otpScreen);
    showElement(formScreen);
  });
}

// ================= FORM → CHOICE =================
if (proceedBtn) {
  proceedBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;

    if (!name || !city) {
      alert("Please fill all details");
      return;
    }

    hideElement(formScreen);
    showElement(choiceScreen);
  });
}

// ================= CHOICE SCREEN =================
document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');

    if (type === 'scan') {
      // 👉 OPEN QR PAGE
      window.location.href = "qr.html";
    } 
    else if (type === 'start') {
      goToLanding();
    } 
    else if (type === 'refer') {
      goToLanding();
    }
  });
});

// ================= OTP RESEND =================
if (resendOtp) {
  resendOtp.addEventListener('click', (event) => {
    event.preventDefault();
    alert('OTP is resent to your mobile number.');
  });
}

// ================= OTP INPUT AUTO MOVE =================
const otpInputs = document.querySelectorAll('.otp-input');

otpInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

// ================= PAGE LOAD =================
window.addEventListener('load', () => {

  // Splash sound
  const dropSound = document.getElementById('dropSound');
  setTimeout(() => {
    dropSound?.play().catch(() => {});
  }, 200);

  // Show continue button
  setTimeout(() => {
    document.getElementById('continueBtn')?.classList.remove('hidden');
  }, 4200);

  // Continue → Login
  const continueBtn = document.getElementById('continueBtn');
  continueBtn?.addEventListener('click', () => {
    document.getElementById('splash-screen')?.classList.add('hidden');
    showElement(loginScreen);
  });
});
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".nav-item.active").classList.remove("active");
    item.classList.add("active");
  });
});