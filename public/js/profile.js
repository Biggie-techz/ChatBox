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

function uploadFile(event) {
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
      alert("Error uploading file: ", error);
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
            // ...
          })
          .catch((error) => {
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
      console.log(user);
      user.photoURL = downloadURL || "https://via.placeholder.com/150";

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
}
