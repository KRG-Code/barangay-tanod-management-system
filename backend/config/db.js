const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
      break; // If connection is successful, exit the loop
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      retries += 1;
      console.log(`Retrying (${retries}/${maxRetries})...`);
      if (retries === maxRetries) {
        process.exit(1); // Exit if max retries reached
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
};

module.exports = connectDB;
