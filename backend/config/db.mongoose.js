const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jeevansetu';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('MongoDB Connected successfully.');
  } catch (err) {
    console.warn('MongoDB connection deferred or offline. Running with fallback store support.');
  }
};

module.exports = connectDB;
