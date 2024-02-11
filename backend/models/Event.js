const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of strings
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  audioFilePath: {
    type: String,
    required: true,
  },
  comments: [{
    text: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postedAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
