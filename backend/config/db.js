const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Could not connect to MongoDB Atlas', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
