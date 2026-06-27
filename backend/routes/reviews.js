const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, reviewController.getReviews);
router.post('/', authMiddleware, reviewController.addReview);

module.exports = router;
