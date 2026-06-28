const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jeevansetu';
<<<<<<< HEAD

  // Print the URI being used (hide your password before sharing the output)
  console.log("Using Mongo URI:");
  console.log(mongoURI);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  }
};

module.exports = connectDB;
=======
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
>>>>>>> b2b364f6c9d4af2eece31998dc4bd6bae08eef70
