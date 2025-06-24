// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  watchlist: {
    type: [Object], // stores movie objects
    default: [],
  },

  watchlists: {
    type: [
      {
        name: { type: String, required: true },
        movies: {
          type: [
            {
              tmdbId: String,
              title: String,
              poster: String,
              addedAt: { type: Date, default: Date.now }
            }
          ],
          default: []
        }
      }
    ],
    default: []
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
