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
const db = firebase.database();
let currentUser;

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user.displayName;
    document.body.innerHTML = `
      <section id="wrapper">
        <div id="header">
          <h4>Current User: ${currentUser}</h4>
          <i class="fa-regular fa-user" onclick="goToProfile()"></i>
          <i class="fa-solid fa-arrow-right-from-bracket" onclick="logOut()"></i>
        </div>
        <div id="mssgBody">
          <!-- message body -->
          <div id="messages">
            <!-- all messages -->
          </div>
          <div id="inputSection">
            <!-- message input and send button -->
            <input type="text" id="mssgInput" />
            <i class="fa-regular fa-paper-plane" id="send" onclick="sendMessage()"></i>
          </div>
        </div>
      </section>`;
    getMessages(); // Load messages when user is authenticated
  } else {
    // User is signed out
    window.location.href = "login.html";
  }
});

function logOut() {
  displayLoader();
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    auth
      .signOut()
      .then(() => {})
      .catch((error) => {
        alert(error.message);
      });
  }, 3000);
}

function sendMessage() {
  const mssgInput = document.getElementById("mssgInput");
  if (!mssgInput.value.trim()) {
    return;
  }

  // Push message to Realtime Database
  const messageData = {
    sender: currentUser,
    message: mssgInput.value,
    date: formatDate(),
    time: formatTime(),
  };

  db.ref("ChatDatabase")
    .push(messageData)
    .then(() => {
      // alert("Message sent successfully!");
      mssgInput.value = ""; // Clear input field after sending
    })
    .catch((error) => {
      alert("Error sending message: " + error.message);
    });
}

function formatTime() {
  const now = new Date();

  // Get hours and format in 12-hour AM/PM
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format time as HH:MM:SS AM/PM
  return `${hours}:${minutes} ${ampm}`;
}

function formatDate() {
  const now = new Date();

  // Get date in MM/DD/YYYY format
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const day = now.getDate().toString().padStart(2, "0");
  const year = now.getFullYear();

  return `${month}/${day}/${year}`;
}

console.log(formatDate());

console.log(formatTime());

function getMessages() {
  // Listen for new messages in the database
  db.ref("ChatDatabase")
    .orderByChild("date")
    .on("value", (snapshot) => {
      messages.innerHTML = ""; // Clear previous messages
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        messages.innerHTML += `
        <div class="mssg">
        <img src="./images/profile_default.png" alt="" />
        <div class="message_content">
        <p class="username">${messageData.sender}</p>
        ${messageData.message}
        </div>
        <div class="time">${messageData.time} </br>${
          messageData.date == formatDate() ? "" : messageData.date
        }</div>
        </div>`;
        document.querySelectorAll(".mssg").forEach((mssg) => {
          if (mssg.querySelector(".username").textContent === currentUser) {
            mssg.classList.add("sender");
          } else {
            mssg.classList.add("received");
          }
        });
      });

      // Scroll to the bottom of the messages container
      messages.scrollTop = messages.scrollHeight;
    });
}

function goToProfile() {
  displayLoader();
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 3000);
}

function displayLoader() {
  document.body.style.background = "white";
  document.body.innerHTML = `
  <div class="container" id="loader">
  	<div class="loader"></div>
  	<div class="loader"></div>
  	<div class="loader"></div>
  </div>
`;
  document.getElementById("loader").style.display = "block";
}
