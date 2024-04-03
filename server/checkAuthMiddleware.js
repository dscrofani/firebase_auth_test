// server/checkAuthMiddleware.js
const admin = require('firebase-admin');

const checkAuth = (req, res, next) => {

    // let's first check to see if we have a session going on
    if (req.session && req.session.userId) {
        return next(); // Session exists, user is authenticated, proceed to the next middleware
        // This will be the flow for all protected routes
    }
    
    // No valid session, proceed to verify ID token with Google. Such a token would have been passed upon signin

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        console.log(idToken);
        admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                req.user = decodedToken;
                console.log("verified");
                next();
            }).catch(error => {
                console.log('failed to verify')
                res.status(403).send('Unauthorized');
            });
    } 
    else {
        res.status(403).send('Unauthorized');
        // or this ...
        // No session and no token provided
        //res.status(401).send('Login required');
        //or redirect to a login screen
    }
};

module.exports = checkAuth;


// The Firebase Admin SDK is designed to work as a singleton, 
// where the initializeApp call configures a global instance 
// that can be used throughout your application. 
// This means you can call admin.initializeApp in your main server file, 
// and as long as your middleware imports the admin object from the Firebase Admin SDK, 
// it will use the same initialized instance.