const { getUser } = require('../Services/auth.js');

// Middleware to restrict access to logged-in users only
async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.headers["authorization"]
    console.log(req.headers);
    if (!userUid) {
        return res.redirect("/login");
    }
    const token=userUid.split('Bearer')[1]
    const user = getUser(token);
    if (!user) return res.redirect('/login');
    req.user = user;
    next();
}

// Middleware to check if a user is authenticated
async function checkAuth(req, res, next) {
    console.log(req.headers);
    const userUid = req.headers["authorization"]
    const token=userUid.split('Bearer')[1]
    const user = getUser(token);
    req.user = user;
    next();
}

// Export the middleware functions
module.exports = { restrictToLoggedinUserOnly, checkAuth };
