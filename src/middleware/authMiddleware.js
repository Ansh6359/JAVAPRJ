const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to authenticate user
const authMiddleware = async (req, res, next) => {
    try {
        // Retrieve the token from the 'user' cookie
        const token = req.cookies.user;

        // If no token is found, redirect to the homepage
        if (!token) {
            return res.status(401).redirect('/');
        }
        const verifyUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // If no user is found, redirect to the homepage
        const user = await User.findOne({ _id:verifyUser._id })
        if (!user) {
            return res.status(401).redirect('/');
        }

        // Attach the token and user information to the request object
        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        // In case of any error, redirect to the homepage with a 401 Unauthorized status
        res.status(401).redirect('/');
    }    
}
  
module.exports = authMiddleware
