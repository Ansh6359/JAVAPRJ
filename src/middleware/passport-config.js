const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure the GoogleStrategy for Passport
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://javaprj.onrender.com/auth/google/callback"
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in the database
            let user = await User.findOne({ googleId: profile.id });

            // If user does not exist, create a new user
            if (!user) {
                user = new User({
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName || '',
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            console.error('An error occurred during Google authentication:', err);
            return done(err, false);
        }
    }));

// Save user information into the current session
passport.serializeUser((user, done) => {
    done(null, user.id); // Save the user's ID to the session
});

// Retrieve user information from the current session
passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;