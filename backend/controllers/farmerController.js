/**
 * Farmer Controller (Mongoose Version) — Phase 2
 */
const { Worker, Equipment, Booking, MandiPrice, WeatherCache } = require('../models');
const { getLiveWeather } = require('../services/weatherService');
const { getLiveMandiPrices } = require('../services/mandiService');
const { createNotification } = require('../utils/notificationHelper');

const farmerController = {
  getLaborers: async (req, res, next) => {
    try {
      const laborers = await Worker.find({});
      
      const normalizedLaborers = laborers.map(l => {
        const obj = l.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      res.json({ laborers: normalizedLaborers });
    } catch (error) {
      next(error);
    }
  },
  
  bookLaborer: async (req, res, next) => {
    try {
      const id = req.params.id;
      const laborer = await Worker.findById(id);
      
      if (!laborer) return res.status(404).json({ error: 'Laborer not found' });
      if (laborer.status === 'Booked') {
        return res.status(400).json({ error: 'Laborer is already booked (double booking prevented)' });
      }
      
      laborer.status = 'Booked';
      await laborer.save();

      const userId = req.user ? req.user.id : 'anonymous';
      await Booking.create({
        item_id: String(id),
        item_type: 'worker',
        user_id: String(userId),
        status: 'Booked'
      });
      
      // Notify the user who booked
      if (req.user && req.user.id) {
        await createNotification(
          String(req.user.id),
          'Laborer Booked ✅',
          `You have successfully booked ${laborer.name}.`,
          'booking'
        );
      }

      res.json({ message: 'Laborer booked successfully' });
    } catch (error) {
      next(error);
    }
  },
  
  getEquipment: async (req, res, next) => {
    try {
      const equipment = await Equipment.find({});
      
      const normalizedEquipment = equipment.map(e => {
        const obj = e.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      res.json({ equipment: normalizedEquipment });
    } catch (error) {
      next(error);
    }
  },
  
  rentEquipment: async (req, res, next) => {
    try {
      const id = req.params.id;
      const eq = await Equipment.findById(id);
      
      if (!eq) return res.status(404).json({ error: 'Equipment not found' });
      if (eq.status === 'Rented') return res.status(400).json({ error: 'Equipment is already rented' });
      
      eq.status = 'Rented';
      await eq.save();

      const userId = req.user ? req.user.id : 'anonymous';
      await Booking.create({
        item_id: String(id),
        item_type: 'equipment',
        user_id: String(userId),
        status: 'Rented'
      });
      
      // Notify the user who rented
      if (req.user && req.user.id) {
        await createNotification(
          String(req.user.id),
          'Equipment Rented ✅',
          `You have successfully rented ${eq.name}.`,
          'booking'
        );
      }

      res.json({ message: 'Equipment rented successfully' });
    } catch (error) {
      next(error);
    }
  },

  returnEquipment: async (req, res, next) => {
    try {
      const id = req.params.id;
      const eq = await Equipment.findById(id);
      if (!eq) return res.status(404).json({ error: 'Equipment not found' });
      
      eq.status = 'Available';
      await eq.save();

      // Resolve existing booking if exists
      const userId = req.user ? req.user.id : 'anonymous';
      await Booking.findOneAndUpdate(
        { item_id: String(id), item_type: 'equipment', user_id: String(userId), status: 'Rented' },
        { status: 'Returned' }
      );

      res.json({ message: 'Equipment returned successfully' });
    } catch (error) {
      next(error);
    }
  },
  
  getMandiPrices: async (req, res, next) => {
    try {
      // 1. Fetch from MongoDB MandiPrice collection
      let prices = await MandiPrice.find({});
      
      // 2. If empty, fetch from live service (which resolves mock data) and seed into MongoDB
      if (!prices || prices.length === 0) {
        const livePrices = await getLiveMandiPrices();
        // Insert into MongoDB
        const promises = livePrices.map(p => MandiPrice.create({
          crop: p.crop,
          market: p.market || 'Sonipat',
          district: p.district || 'Sonipat',
          state: p.state || 'Haryana',
          price: p.price,
          trend: p.trend,
          date: p.date || new Date().toLocaleDateString()
        }));
        await Promise.all(promises);
        prices = await MandiPrice.find({});
      }

      const normalizedPrices = prices.map(p => {
        const obj = p.toObject();
        obj.id = String(obj._id);
        
        // Ensure mandiPrices have sonipat, narela, rohtak fields to map to frontend table
        if (!obj.sonipat) {
          obj.sonipat = obj.price;
          obj.narela = obj.price;
          obj.rohtak = obj.price;
        }
        return obj;
      });

      res.json({ prices: normalizedPrices });
    } catch (error) {
      next(error);
    }
  },

  getWeather: async (req, res, next) => {
    try {
      const location = req.query.location || 'Sonipat';
      
      // Fetch cached weather from MongoDB
      let cached = await WeatherCache.findOne({ location });
      
      // Check cache validity (15 mins)
      const isCacheValid = cached && (Date.now() - new Date(cached.updatedAt).getTime() < 15 * 60 * 1000);
      
      if (!isCacheValid) {
        // Fetch fresh weather from service
        const freshWeather = await getLiveWeather();
        
        if (cached) {
          // Update cache
          cached.temp = freshWeather.temperature;
          cached.humidity = freshWeather.humidity;
          cached.rain = freshWeather.rain;
          cached.wind = freshWeather.wind_speed;
          cached.forecast = freshWeather.forecast;
          await cached.save();
        } else {
          // Create cache
          cached = await WeatherCache.create({
            location,
            temp: freshWeather.temperature,
            humidity: freshWeather.humidity,
            rain: freshWeather.rain,
            wind: freshWeather.wind_speed,
            forecast: freshWeather.forecast
          });
        }
      }

      res.json({
        weather: {
          temperature: cached.temp,
          humidity: cached.humidity,
          rain: cached.rain,
          wind_speed: cached.wind,
          forecast: cached.forecast
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = farmerController;
