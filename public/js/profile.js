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
console.log(auth);

const storage = firebase.storage();

const username = document.getElementById("profileName");
const defaultProfileImage = './images/profile_default.png';
const profileImg = document.getElementById("profileImg");

function pickFile(event) {
  const file = event.target.files[0];
  const storageRef = storage.ref(`${auth.currentUser.email}`);
  const uploadTask = storageRef.put(file);
  
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      alert("Upload failed: " + error.message);
      console.log(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        const user = auth.currentUser;
        console.log(downloadURL);
        
        console.log(auth.currentUser.photoURL);

        user.updateProfile({
          photoURL: downloadURL
        }).then(() => {
          alert("Profile updated successfully");
          console.log(auth.currentUser.photoURL);
          checkUser();
        }).catch((error) => {
          alert("Error updating profile: " + error.message);
          console.log(error);
        });
      });
    }
  );
}

function checkUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = user.displayName;
      username.textContent = currentUser;
      profileImg.style.backgroundImage = user.photoURL ? `url(${user.photoURL})` : `url(${defaultProfileImage})`;
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
  auth.signOut().then(() => {
    document.getElementById("loader").style.display = "none";
    window.location.href = "login.html"; // Redirect after sign-out
  }).catch((error) => {
    alert(error.message);
  });
}
