const mongoose = require('mongoose');
const { DIFFICULTIES, OUTCOMES } = require('../utils/constants');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, 'Company is required'], trim: true, maxlength: 80 },
    role: { type: String, required: [true, 'Role is required'], trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 80, default: '' },
    outcome: { type: String, enum: OUTCOMES, default: 'Awaiting result' },
    difficulty: { type: String, enum: DIFFICULTIES, default: 'Medium' },
    rounds: { type: Number, min: [1, 'At least 1 round'], max: [10, 'At most 10 rounds'], default: 1 },
    content: {
      type: String,
      required: [true, 'Describe your interview experience'],
      trim: true,
      minlength: [50, 'Write at least 50 characters about the interview'],
      maxlength: [5000, 'Keep the description under 5000 characters'],
    },
    tips: { type: String, trim: true, maxlength: 1000, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
