// Initialize Firebase (same as the signup page)
const firebaseConfig = {
  apiKey: "AIzaSyBRlPlxcrScNiHD8vO4zFNFFgJZe42Lcjg",
  authDomain: "chatbox-f16bb.firebaseapp.com",
  databaseURL: "https://chatbox-f16bb-default-rtdb.firebaseio.com",
  projectId: "chatbox-f16bb",
  storageBucket: "chatbox-f16bb.appspot.com",
  messagingSenderId: "253131366706",
  appId: "1:253131366706:web:1860f6419c39065480772b",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider();
console.log(auth);

// Get form elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("submit");

email.addEventListener("input", () => {
  document.getElementById("emailPlaceholder").innerText = "email";
  document.getElementById("emailPlaceholder").style.color = "grey";
  clearErrorMessage();
});

password.addEventListener("input", () => {
  document.getElementById("passwordPlaceholder").innerText = "Password";
  document.getElementById("passwordPlaceholder").style.color = "grey";
  clearErrorMessage();
});

function sendEmailVerification() {
  form.innerHTML = `<p>Please Verify you email before signin in.</p>
   <p>Please check your email. A new verification link has been sent to your inbox.</p>
   <p>If you don't see the email in your inbox, check your spam folder.</p>
   <button class="btn btn-primary" onclick="iHaveVerified()"  >I have verified</button>
   `;
}

function iHaveVerified() {
  document.body.innerHTML = `
    <div class="spinner" id="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>`;
  document.getElementById("loader").style.display = "block";
  setTimeout(() => {
    window.location.href = "login.html"
  }, 2000);
}

submit.addEventListener("click", (event) => {
  event.preventDefault();

  if (email.value === "" || password.value === "") {
    alert("Please fill in all fields!");
    return;
  }

  displayLoadingSpinner();

  // Sign in using Firebase
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      var user = userCredential.user;
      if (auth.currentUser.emailVerified) {
        document.body.style.backgroundColor = "#fff";
        document.body.innerHTML = `
        <div class="spinner" id="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>`;
        document.getElementById("loader").style.display = "block";
        setTimeout(() => {
          document.getElementById("loader").style.display = "none";
          handleLoginSuccess();
        }, 2000);
      } else {
        sendEmailVerification();
      }
    })
    .catch((error) => {
      submit.innerHTML = "Log in";
      if (error.code === "auth/invalid-email") {
        handleInvalidemail();
      } else if (error.code === "auth/invalid-credential") {
        handleInvalidPassword();
      } else if (error.code === "auth/too-many-requests") {
        handleAccountBlocked();
      } else {
        alert(error.code);
      }
    });
});

document.getElementById("dontHaveAnAccount").addEventListener("click", () => {
  document.body.style.background = "white";
  document.body.innerHTML = `
    <div class="spinner" id="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>`;
  document.getElementById("loader").style.display = "block";
  setTimeout(() => {
    document.getElementById("loader").style.display = "block";
    window.location.href = "signup.html";
  }, 2000);
});

// Functions
function handleInvalidemail() {
  password.value = "";
  document.getElementById("emailPlaceholder").innerText = "Invalid email";
  document.getElementById("emailPlaceholder").style.color = "red";
}

function handleInvalidPassword() {
  password.value = "";
  document.getElementById("passwordPlaceholder").innerText = "Invalid Password";
  document.getElementById("passwordPlaceholder").style.color = "red";
}

function handleAccountBlocked() {
  document.getElementById("form").innerHTML = `
      <p>Your account has been temporarily blocked due to too many failed login attempts. Try again later.</p>`;
}

function handleLoginSuccess() {
  submit.innerHTML = `<div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  setTimeout(() => {
    window.location.href = "chat.html";
  }, 1500);
}

function displayLoadingSpinner() {
  submit.innerHTML = `<div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
}

function clearErrorMessage() {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.remove();
  }
}
