/**
 * Report Routes (Admin)
 *
 * WHY CHANGED: Previously had NO auth middleware at all. Every controller
 * method reads req.user.role, which crashed with "Cannot read properties
 * of undefined (reading 'role')". Added authMiddleware to all routes.
 */
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, reportController.getReports);
router.post('/:id/strike', authMiddleware, reportController.addStrike);
router.post('/:id/safe', authMiddleware, reportController.markSafe);
router.post('/flagged/:id/blacklist', authMiddleware, reportController.blacklistUser);

module.exports = router;
