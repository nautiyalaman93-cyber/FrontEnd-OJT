/**
 * @file passport.js
 * @description Google OAuth 2.0 Strategy using Passport.js.
 *
 * HOW IT WORKS:
 * 1. User clicks "Login with Google" on the frontend.
 * 2. We redirect them to Google's login page.
 * 3. After they approve, Google sends us their profile info.
 * 4. We check our DB:
 *    - If the user exists → just return their data.
 *    - If the user is new → create a new record in MongoDB.
 * 5. The user is now "logged in" in our system.
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists → just return them
          return done(null, user);
        }

        // User doesn't exist → create a new one
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Needed for session-based (we use JWT so these are minimal)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
