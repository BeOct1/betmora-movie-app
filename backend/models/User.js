// models/User.js
import mongoose from 'mongoose';

// User schema definition
// This schema defines the structure of the User document in MongoDB.
// It includes fields for name, email, password, and a watchlist.
// The watchlist is an array of movie objects that the user has saved.
// The schema also includes timestamps for createdAt and updatedAt fields.
// The email field is unique and required, ensuring that no two users can have the same email.
// The password field is also required, and it should be hashed before saving to the database for security.
// The watchlist field defaults to an empty array if no movies are saved by the user.
// The schema is exported as a Mongoose model named 'User', which can be used to interact with the users collection in the MongoDB database.
// The model can be used to create, read, update, and delete user documents in the database.
// The model is used in the backend to handle user authentication, registration, and managing the user's watchlist.
// The timestamps option automatically adds createdAt and updatedAt fields to the schema, which are useful for tracking when a user was created and last updated.
// This schema is part of the backend codebase, specifically for managing user data in a movie-related application.
// It is designed to work with Mongoose, a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
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
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
