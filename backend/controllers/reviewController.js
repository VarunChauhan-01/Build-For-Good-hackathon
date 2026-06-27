/**
 * Review Controller (Mongoose Version) — Phase 2
 * Reviews with average rating calculation and notifications.
 */
const { Review, User } = require('../models');
const { createNotification } = require('../utils/notificationHelper');

const reviewController = {
  getReviews: async (req, res, next) => {
    try {
      const { target_id, target_type } = req.query;
      const filter = {};

      if (target_id) {
        filter.target_id = String(target_id);
      }
      if (target_type) {
        filter.target_type = target_type;
      }

      const reviews = await Review.find(filter).sort({ createdAt: -1 });

      // Enrich with reviewer name
      const enrichedReviews = await Promise.all(reviews.map(async (r) => {
        const obj = r.toObject();
        obj.id = String(obj._id);
        const reviewer = await User.findById(obj.reviewer_id);
        if (reviewer) {
          obj.reviewerName = reviewer.name;
        }
        return obj;
      }));

      // Calculate average rating for the target
      let avgRating = 0;
      if (reviews.length > 0) {
        avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        avgRating = Math.round(avgRating * 10) / 10;
      }

      res.json({ reviews: enrichedReviews, avgRating, totalReviews: reviews.length });
    } catch (error) {
      next(error);
    }
  },

  addReview: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const { target_id, target_type, rating, comment } = req.body;
      if (!target_id || !rating) {
        return res.status(400).json({ error: 'Target ID and rating are required' });
      }

      // Prevent self-review
      if (target_id === req.user.id) {
        return res.status(400).json({ error: 'You cannot review yourself' });
      }

      const review = await Review.create({
        reviewer_id: String(req.user.id),
        target_id: String(target_id),
        target_type: target_type || 'worker',
        rating: Number(rating),
        comment: comment || ''
      });

      // Update the target user's average rating
      const allReviews = await Review.find({ target_id: String(target_id) });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await User.findByIdAndUpdate(target_id, { rating: Math.round(avgRating * 10) / 10 });

      // Notify the reviewed user
      const reviewer = await User.findById(req.user.id);
      const reviewerName = reviewer ? reviewer.name : 'Someone';
      await createNotification(
        String(target_id),
        'New Review Received ⭐',
        `${reviewerName} gave you a ${rating}-star review.`,
        'review'
      );

      const reviewObj = review.toObject();
      reviewObj.id = String(reviewObj._id);

      res.status(201).json({ message: 'Review submitted successfully', review: reviewObj, avgRating: Math.round(avgRating * 10) / 10 });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewController;
