const express = require('express');
const router = express.Router();

const verificationController = require('../controllers/verificationController');
const { authMiddleware } = require('../middleware/auth');

// IMPORTANT: authMiddleware must be applied

router.post('/request-otp', authMiddleware, verificationController.requestOtp);
router.post('/verify-otp', authMiddleware, verificationController.verifyOtp);
router.get('/status', authMiddleware, verificationController.getStatus);

module.exports = router;
