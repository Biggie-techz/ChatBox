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
const database = firebase.database();
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
    auth
      .signOut()
      .then(() => {})
      .catch((error) => {
        alert(error.message);
      });
  }, 2000);
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
    time: new Date().toLocaleTimeString(),
  };

  database
    .ref("ChatDatabase")
    .push(messageData)
    .then(() => {
      // alert("Message sent successfully!");
      mssgInput.value = ""; // Clear input field after sending
    })
    .catch((error) => {
      alert("Error sending message: " + error.message);
    });
}

function getMessages() {
  // Listen for new messages in the database
  database
    .ref("ChatDatabase")
    .orderByChild("time")
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
        <div class="time">${messageData.time}</div>
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
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 2000);
}
