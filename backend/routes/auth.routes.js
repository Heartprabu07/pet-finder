const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const  verifyToken  = require('../middleware/auth.middleware');

// User Registration
router.post('/register', authController.register);

// // User Login
router.post('/login', authController.login);

// Get all users
router.get('/allusers', verifyToken, authController.getAllUsers);

router.get('/changestatus/:userId', verifyToken, authController.changeUserStatus);


router.get('/dashboardStats', verifyToken, authController.dashboardStats);


// // Get User Profile (Protected Route)
router.get('/profile', verifyToken, authController.getUserProfile);

// // Update User Profile (Protected Route)
router.put('/profile', verifyToken, authController.updateUserProfile);

// // Delete User Account (Protected Route)
router.get('/deleteuser/:userId', verifyToken, authController.deletUser);

module.exports = router;
