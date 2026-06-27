const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { optionalAuth } = require('../middleware/auth');

router.get('/laborers', farmerController.getLaborers);
router.post('/laborers/:id/book', optionalAuth, farmerController.bookLaborer);
router.get('/equipment', farmerController.getEquipment);
router.post('/equipment/:id/rent', optionalAuth, farmerController.rentEquipment);
router.post('/equipment/:id/return', optionalAuth, farmerController.returnEquipment);
router.get('/mandi-prices', farmerController.getMandiPrices);
router.get('/weather', farmerController.getWeather);

module.exports = router;
