import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userService from '../services/user.service.js';

// Configure GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // From GitHub OAuth App
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // From GitHub OAuth App
      callbackURL: process.env.GITHUB_CALLBACK_URL, // Matches your OAuth app settings
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await userService.getUserByEmail(profile.emails[0].value);
        if (!user) {
          // Create a new user
          user = await userService.createUser({
            email: profile.emails[0].value,
            username: profile.username || profile.displayName,
            password: null, // No password for OAuth users
            otp: null, // Bypass OTP
            isVerified: true, // Mark as verified
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
