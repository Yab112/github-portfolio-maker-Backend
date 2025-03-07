import mongoose from "mongoose";

const tokenDenylistSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  expires: { type: Date, required: true }
});

// Auto-expire documents
tokenDenylistSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('TokenDenylist', tokenDenylistSchema);
