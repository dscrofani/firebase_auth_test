const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
const checkAuth = require('./checkAuthMiddleware'); // Import the checkAuth middleware
const serviceAccount = require('../authentication-test-c6bc1-firebase-adminsdk-ydhdf-d269572765.json')
// Unless we are setting a GOOGLE_APPLICATION_CREDENTIALS env variable then we need a service account
// To obtain a service account JSON file:
// Go to the Firebase Console -> Project Settings -> Service accounts.
// Click "Generate new private key", and a JSON file will be downloaded.
// Of course make sure to not put the private key under version management (ie github)

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //credential: admin.credential.applicationDefault(),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const session = require('express-session');

app.use(session({
  secret: 'your_secret_key', // ***** PICK A SECRET KEY *****
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ***** Set to true if using https *****
}));
// ***** Using default server memory for session store above.
// ***** Of course will have to change for production, to Redis or Mongo etc.

app.post('/verifyToken', checkAuth, (req, res) => {
    // If the token was verified successfully by the checkAuth middleware,
    // Proceed to use the user's information or establish a session.
    // The checkAuth middleware has already verified the token.
    // Establish a session or perform other actions related to the authenticated user.
    if (!req.session.user) {
        // Assuming session middleware is in use and a session hasn't already been established
        // Note that req.user has been defined and made available by the checkAuth middleware: req.user = decodedToken;
        // Note that req.user here is really the decodedToken from the checkAuthMiddleware
        req.session.userId = { uid: req.user.uid }; // Establish a new session with user information
        req.session.email = req.user.email // for testing let's also store the email form the dcoded token in the session
    }
    res.json({ status: 'success', uid: req.user.uid });
    // ***** Decide what to really do with them upon successful signin *****
});

// Protected route example using the checkAuth middleware
app.get('/api/protected', checkAuth, (req, res) => {
    console.log(req.session.email); // log the email previously stored in the session for testing
    res.send(`This is a protected route. Your UID is: ${req.session.userId}`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
