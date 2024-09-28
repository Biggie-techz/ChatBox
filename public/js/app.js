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

// Get elements from the HTML
let form = document.getElementById("form");
const firstName = document.getElementById("firstName");
const firstNamePlaceholder = document.getElementById("firstNamePlaceholder");
const lastName = document.getElementById("lastName");
const lastNamePlaceholder = document.getElementById("lastNamePlaceholder");
const username = document.getElementById("username");
const usernamePlaceholder = document.getElementById("usernamePlaceholder");
const email = document.getElementById("email");
const emailPlaceholder = document.getElementById("emailPlaceholder");
const phone = document.getElementById("phone");
const phonePlaceholder = document.getElementById("phonePlaceholder");
const password = document.getElementById("password");
const passwordPlaceholder = document.getElementById("passwordPlaceholder");
const confirmPassword = document.getElementById("confirmPassword");
const confirmPasswordPlaceholder = document.getElementById(
  "confirmPasswordPlaceholder"
);
let submit = document.getElementById("submit");

// Regular Expressions for validation
const nameRegex = /^[A-Za-z]+[a-zA-Z-]+[A-Za-z]+$/;
const usernameRegex = /^[a-zA-Z_\9]+[a-zA-Z0-9-_]+[a-zA-Z\d]+$/;
const phoneRegex = /^[0][7-9][0-1][0-9]{8}$/;
const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/;

// Function to display validation feedback
const displayFeedback = (
  inputElement,
  placeholderElement,
  isValid,
  defaultText,
  errorMessage
) => {
  if (isValid || inputElement.value === "") {
    inputElement.style.outline = "none";
    inputElement.style.border = "1px solid rgba(105, 105, 105, 0.397)";
    placeholderElement.style.color = "grey";
    placeholderElement.style.borderColor = "grey";
    placeholderElement.innerHTML = defaultText;
  } else {
    inputElement.style.border = "2px solid red";
    placeholderElement.style.color = "red";
    placeholderElement.style.borderColor = "red";
    placeholderElement.innerHTML = errorMessage;
  }
};

// First Name validation
firstName.addEventListener("input", () => {
  displayFeedback(
    firstName,
    firstNamePlaceholder,
    nameRegex.test(firstName.value),
    "First Name",
    "e.g: John"
  );
});

// Last Name validation
lastName.addEventListener("input", () => {
  displayFeedback(
    lastName,
    lastNamePlaceholder,
    nameRegex.test(lastName.value),
    "Last Name",
    "e.g: Smith"
  );
});

// Username validation
username.addEventListener("input", () => {
  displayFeedback(
    username,
    usernamePlaceholder,
    usernameRegex.test(username.value),
    "Username",
    "e.g: John_Smith123"
  );
});

// Email validation
email.addEventListener("input", () => {
  displayFeedback(
    email,
    emailPlaceholder,
    emailRegex.test(email.value),
    "Email",
    "e.g: example@yahoo.com"
  );
});

// Phone validation
phone.addEventListener("input", () => {
  displayFeedback(
    phone,
    phonePlaceholder,
    phoneRegex.test(phone.value),
    "Phone Number",
    "e.g: 08012345678"
  );
});

// Password validation
password.addEventListener("input", () => {
  displayFeedback(
    password,
    passwordPlaceholder,
    passwordRegex.test(password.value),
    "Password",
    "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
  );
  confirmPassword.dispatchEvent(new Event("input"));
});

// Confirm Password validation
confirmPassword.addEventListener("input", () => {
  const isMatching = confirmPassword.value === password.value;
  displayFeedback(
    confirmPassword,
    confirmPasswordPlaceholder,
    isMatching,
    "Confirm Password",
    "Passwords do not match"
  );
});

function sendEmailVerification() {
  form.innerHTML = `<p>A verification link has been sent to your email.</p>
   <p>Please check your email and click on the verification link to complete your registration.</p>
   <p>If you don't see the email, check your spam folder.</p>
   <button class="btn btn-primary" onclick="iHaveVerified()"  >I have verified</button>
   `;
}

function iHaveVerified() {
  document.getElementById("form").innerHTML = `
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
    window.location.href = "login.html";
  }, 2000);
}

submit.addEventListener("click", (event) => {
  event.preventDefault();
  if (
    nameRegex.test(firstName.value) &&
    nameRegex.test(lastName.value) &&
    usernameRegex.test(username.value) &&
    emailRegex.test(email.value) &&
    phoneRegex.test(phone.value) &&
    passwordRegex.test(password.value) &&
    confirmPassword.value === password.value
  ) {
    submit.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>`;

    auth
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;

        // Send email verification
        user
          .sendEmailVerification()
          .then(() => {
            // Update user profile
            user
              .updateProfile({
                displayName: username.value,
              })
              .then(() => {
                // Clear form and show email verification message
                firstName.value = "";
                lastName.value = "";
                username.value = "";
                email.value = "";
                phone.value = "";
                password.value = "";
                confirmPassword.value = "";

                sendEmailVerification();
              })
              .catch((error) => {
                alert("Error updating profile: " + error.message);
              });
          })
          .catch((error) => {
            alert("Error sending email verification: " + error.message);
          });
      })
      .catch((error) => {
        alert("Error creating user: " + error.message);
      });
  } else {
    alert("Please input all fields correctly");
  }
});

document.getElementById("haveAnAccount").addEventListener("click", () => {
  document.body.style.background = "white";
  document.getElementById("form").innerHTML = `
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
    window.location.href = "login.html";
  }, 2000);
});
