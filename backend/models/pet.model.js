const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  petName: { type: String, required: true },
  species: { type: String, required: true },
  petBreed: { type: String, required: true },
  petAge: { type: Number, required: true },
  petFeatures: { type: String },
  petPhoto: { type: String },
  status: { type: Number, enum: [0, 1], default: 0}, // 0 = lost, 1 = found
  lastSeenAddress: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateReported: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', PetSchema);
