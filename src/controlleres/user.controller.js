import { userService } from "../services/user.service.js";
import User from "../models/user.model.js";

export const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updatedUser = await userService.updateUserProfile(
        req.user.id,
        req.body
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updatePassword: async (req, res) => {
    try {
      await userService.updateUserPassword(req.user.id, req.body);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      await userService.deleteUserAccount(req.user.id);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      await userService.initiatePasswordReset(req.body.email);
      res.json({ message: "Password reset instructions sent to email" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      await userService.completePasswordReset(req.body);
      res.json({ message: "Password reset successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // getUserRepos: async (req, res) => {
  //   try {
  //     const userId = req.cookies.userId || req.user._id;

  //     if (!userId) {
  //       return res.status(401).json({ error: "User not authenticated" });
  //     }

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     const { githubUsername } = user;

  //     // Fetch public repositories
  //     const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
  //     const response = await fetch(githubApiUrl);

  //     // Extract repository names
  //     console.log("DEBUG:check the result back",response)
  //     const data = await response.json();
  //     console.log("DEBUG: error  in the data",data)
  //     const repoNames =data ? data.map((repo) => repo.name): [];


  //     return res.json({ repos: repoNames });
  //   } catch (error) {
  //     console.error(error);
  //     return res
  //       .status(500)
  //       .json({ error: "An error occurred while fetching repos" });
  //   }
  // },
};
