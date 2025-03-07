import { userService } from "../services/user.service.js";
import {getChatStream} from "../services/groq.service.js"
import { validateInput } from "../helper/validators.js";
import { handleStreamError } from "../helper/errorHandler.js";

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

  streamChatCompletion: async (req, res) => {
    try {
      const { prompt } = req.body;

      // Validate input
      const validationError = validateInput(prompt);
      if (validationError) {
        return res.status(400).json(validationError);
      }

      // Set up streaming headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      
      // Get the stream from service
      const stream = await getChatStream(prompt);

      // Stream the response to client
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(content);
      }

      res.end();
    } catch (error) {
      handleStreamError(error, res);
    }
  },


};
