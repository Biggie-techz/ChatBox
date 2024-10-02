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
let currentUserName;
let index = 0;

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = auth.currentUser;
    currentUserName = currentUser.displayName;
    document.body.innerHTML = ` 
      <section id="wrapper">
        <div id="header">
          <h4>Current User: ${currentUserName}</h4>
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
            <button class="btn" id="send" onclick="sendMessage()"><i class="fa-regular fa-paper-plane"></i></button>
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
  db.ref(`chat/${chatIndex}`)
    .set({
      sender: currentUserName,
      message: mssgInput.value,
      date: formatDate(),
      time: formatTime(),
      profilePic: currentUser.photoURL
        ? currentUser.photoURL
        : "./images/profile_default.png",
    })
    .then(() => {
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
  db.ref("chat")
    .orderByChild("date")
    .on("value", (snapshot) => {
      const data = snapshot.val() || [];
      chatIndex = data.length;
      console.log(data);
      data.forEach((data) => {
        index++;
        data.id = index;
      });
      messages.innerHTML = ""; // Clear previous 55messages
      data.forEach(({ sender, message, date, time, profilePic, id }) => {
        messages.innerHTML += `
        <div class="mssg">
          <img src="${profilePic}" alt="" />
          <div class="message_content">
            <p class="username">${sender}</p>
            ${message}
          </div>
          <div class="time">${time} </br>${
          date == formatDate() ? "" : date
        }</div>
        </div>`;
        document.querySelectorAll(".mssg").forEach((mssg) => {
          if (mssg.querySelector(".username").textContent === currentUserName) {
            mssg.classList.add("sender");
            let options = mssg.querySelector(".time");

            mssg.addEventListener("click", () => {
              options.classList.add("options");
              options.innerHTML = ` 
                <ul>
                <li onclick="editMessage(${id}, '${message}')">Edit</li>
                <li onclick="deleteMessage()">Delete</li>
                </ul>`;
              mssg.style.zIndex = 1000;
              document.getElementById("mssgBody").style.backgroundColor =
                "rgba(0, 0, 0, 0.5)";
            });
            mssg.addEventListener("mouseleave", () => {
              document.getElementById("mssgBody").style.backgroundColor =
                "transparent";
              options.innerHTML = `${time}`;
              options.classList.remove("options");
              mssg.style.zIndex = 1;
            });
          } else {
            mssg.classList.add("received");
          }
        });
      });

      // Scroll to the bottom of the messages container
      messages.scrollTop = messages.scrollHeight;
    });
}

getMessages();

function editMessage(id, message) {
  const mssgInput = document.getElementById("mssgInput");
  mssgInput.value = message;
  db.ref(`chat/${id}`).update({
    message: mssgInput.value
  }).then(() => {
    mssgInput.value = ""; // Clear input field after sending
  })
  .catch((error) => {
    alert("Error sending message: " + error.message);
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
  </div>`;
  document.getElementById("loader").style.display = "block";
}
