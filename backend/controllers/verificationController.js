/**
 * Verification Controller (Mongoose Version) — Phase 2
 */
const { User, Verification } = require('../models');
const { createNotification } = require('../utils/notificationHelper');

// Mock OTP storage
const otpStore = new Map();

const verificationController = {
  requestOtp: async (req, res, next) => {
    try {
      const { aadhaar } = req.body;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const userId = req.user.id;

      if (!aadhaar || aadhaar.replace(/\s/g, '').length !== 12) {
        return res.status(400).json({ error: 'Valid 12-digit Aadhaar number is required' });
      }

      const cleanedAadhaar = aadhaar.replace(/\s/g, '');

      // Store mock OTP
      otpStore.set(userId, {
        aadhaar: cleanedAadhaar,
        otp: '123456',
        expires: Date.now() + 10 * 60 * 1000 // 10 minutes
      });

      const masked = `XXXX-XXXX-${cleanedAadhaar.slice(-4)}`;

      res.json({
        message: 'OTP sent successfully',
        masked_aadhaar: masked
      });

    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { otp } = req.body;

      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const userId = req.user.id;

      const stored = otpStore.get(userId);
      if (!stored) {
        return res.status(400).json({ error: 'No OTP request found or expired' });
      }

      if (Date.now() > stored.expires) {
        otpStore.delete(userId);
        return res.status(400).json({ error: 'OTP expired' });
      }

      if (stored.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      const newTrustScore = 95;
      const maskedAadhaar = `XXXX-XXXX-${stored.aadhaar.slice(-4)}`;

      // Update User collection in MongoDB
      const user = await User.findByIdAndUpdate(userId, {
        is_verified: 1,
        trust_score: newTrustScore,
        aadhaar_masked: maskedAadhaar
      }, { new: true });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create Verification log entry
      await Verification.create({
        user_id: String(userId),
        aadhaar_masked: maskedAadhaar,
        status: 'verified'
      });

      otpStore.delete(userId);

      // Notify user about verification
      await createNotification(
        String(userId),
        'Aadhaar Verified ✅',
        'Your Aadhaar identity has been verified. Your trust score is now 95/100.',
        'verification'
      );

      res.json({
        message: 'Identity verified successfully',
        status: 'verified',
        trust_score: newTrustScore
      });

    } catch (error) {
      next(error);
    }
  },

  getStatus: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        verification: {
          status: user.is_verified === 1 ? 'verified' : 'unverified',
          aadhaar_masked: user.aadhaar_masked || null
        }
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = verificationController;