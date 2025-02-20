const { encryptPassword, decryptPassword } = require('../helpers/authHelper');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Pet = require('../models/pet.model');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email,phoneNumber, password } = req.body;
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email Or Phone Number already exists' });
    }

    const { encryptedPassword, iv } = encryptPassword(password);
    // Save the user
    const newUser = new User({ name, email,phoneNumber, password: encryptedPassword,iv:iv,status:0});
    await newUser.save();


    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    let emailOrPhone = req.body.emailOrPhone;
    let inputpassword = req.body.password;

    if (!emailOrPhone || !inputpassword) {
      return res.status(400).json({ status: 400, message: 'All fields are required' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
    });

    if (!user) {
      return res.status(400).json({ status: 400, message: 'Invalid credentials' });
    }

    // If user is a pet owner, check their status
    if (user.role === 'pet_owner' && user.status !== 1) {
      return res.status(403).json({ status: 403, message: 'Your account is not active. Please contact support.' });
    }

    const { password, iv } = user;

    // Decrypt the password
    const decryptedPassword = decryptPassword(password, iv);

    // Compare decrypted password with the input password
    if (decryptedPassword === inputpassword) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        status: 200,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ status: 401, message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Server error', error });
  }
};



// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All users
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find({ role: 'pet_owner' }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    const missingPetsCount = await Pet.countDocuments({ status: 0 }); // Assuming 0 means missing pets
    const sightedPetsCount = await Pet.countDocuments({ status: 1 }); // Assuming 1 means sighted pets
    const petOwnersCount = await User.countDocuments({ role: 'pet_owner' });

    res.status(200).json({
      data: {
        missingPets: missingPetsCount,
        sightedPets: sightedPetsCount,
        petOwners: petOwnersCount
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.changeUserStatus = async (req, res) => {
  try {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Toggle the status (if 1 → 0, if 0 → 1)
      user.status = user.status === 1 ? 0 : 1;
      await user.save();

      res.status(200).json({
          success: true,
          message: `User status updated to ${user.status === 1 ? 'Active' : 'Inactive'}`,
          user
      });

  } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete User Account
exports.deletUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
