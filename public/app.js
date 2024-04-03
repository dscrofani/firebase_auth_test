// Import the functions needed from the SDKs needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// Had to change the above version from 9.x.x to 10.0.0 or file were not available


// TODO: Add SDKs for Firebase products I want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
// const firebaseConfig = {
//     // Firebase config object: ***** Get this from the Google Cloud Firebase project? *****
// };

const firebaseConfig = {
    apiKey: "AIzaSyDy9FRIrBMiXjRvUfaikRIYbxTt3nA2hJ0",
    authDomain: "authentication-test-c6bc1.firebaseapp.com",
    projectId: "authentication-test-c6bc1",
    storageBucket: "authentication-test-c6bc1.appspot.com",
    messagingSenderId: "440427681451",
    appId: "1:440427681451:web:fefb6dab00da33acd649ee",
    measurementId: "G-F1MP66RWR0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Example: Sign in with Google
const provider = new GoogleAuthProvider();
document.getElementById("sign-in-button").addEventListener("click", () => {
    signInWithPopup(auth, provider).then((result) => {
        // Handle result
        result.user.getIdToken().then((token) => {
            console.log(token);
            // Now send this token to the server
            fetch('/verifyToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            }).then(response => response.json()).then(data => {
                console.log('Token verified by server:', data);
            }).catch((error) => {
                console.error('Error:', error);
            });
        })
    }).catch((error) => {
        // Handle errors
    });
});
