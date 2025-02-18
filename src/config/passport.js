import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; 
import generateRandomPassword from "../utils/generatePassword.js";
import { sendCredintial } from "../services/sendEmailService.js";
import { generateHash } from "../utils/passwordUtils.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/v1/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value; 
        const username = profile.username;

        if (!email) {
          return done(null, false, { message: "GitHub email is required." });
        }

        let user = await User.findOne({ email });

        if (!user) {
          const plainPassword = generateRandomPassword();
          const hashedPassword = await generateHash(plainPassword);

          user = new User({
            email,
            Githubusername: username,
            password: hashedPassword,
            authProvider: "github",
            isVerified:true,
          });

          await user.save();

          // Send email with credentials
          await sendCredintial(email,plainPassword);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
