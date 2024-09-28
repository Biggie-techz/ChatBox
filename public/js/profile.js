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
const storage = firebase.storage();

let currentUser;
let username = document.getElementById("profileName");
let defaultProfileImage = './images/profile_default.png'

let profilePic = document.getElementById("profileImg");
function pickFile(event) {
  const file = event.target.files[0];
  var storageRef = storage.ref("profilePic");
  var uploadTask = storageRef.put(file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log(snapshot);
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      alert(error.code);
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        const user = firebase.auth().currentUser;

        user
          .updateProfile({
            photoURL: downloadURL,
          })
          .then(() => {
            // Update successful
            checkUser();
            // ...
          })
          .catch((error) => {
            alert("Error updating profile: ", error);
            // An error occurred
            // ...
          });
      });
    }
  );
}

function checkUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user.displayName;
      username.textContent = currentUser
      console.log(user);
      user.photoURL ? profilePic.style.backgroundImage = user.photoURL : profilePic.style.backgroundImage = `url(${defaultProfileImage})`;
    } else {
      window.location.href = "login.html";
    }
  });
}

checkUser();

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

function goToChatPage() {
  displayLoader();
  setTimeout(() => {
    window.location.href = "chat.html";
  }, 3000);
}

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
