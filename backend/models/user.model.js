const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  phoneNumber: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        // If phoneNumber is provided, validate it
        return v == null || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  password: { type: String, required: true },
  iv: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ['admin', 'pet_owner'], default: 'pet_owner' },
  status: { type: Number, enum: [0, 1], default: 0}, // 0 = Inactive, 1 = active
},
{
  timestamps: true,  // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);