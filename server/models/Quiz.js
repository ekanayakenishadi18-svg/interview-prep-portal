const mongoose = require('mongoose');
const { CATEGORIES, DIFFICULTIES } = require('../utils/constants');

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: [true, 'Every quiz question needs text'], trim: true },
  options: {
    type: [{ type: String, trim: true }],
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6 && v.every((o) => o && o.length > 0),
      message: 'Each question needs between 2 and 6 non-empty options',
    },
  },
  correctIndex: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator(v) {
        return v < this.options.length;
      },
      message: 'The correct answer must be one of the options',
    },
  },
  explanation: { type: String, trim: true, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [120, 'Title must be 120 characters or fewer'],
    },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    difficulty: { type: String, enum: DIFFICULTIES, default: 'Medium' },
    timeLimit: {
      type: Number,
      default: 10,
      min: [1, 'Time limit must be at least 1 minute'],
      max: [120, 'Time limit must be 120 minutes or less'],
    },
    questions: {
      type: [mcqSchema],
      validate: { validator: (v) => v.length > 0, message: 'Add at least one question' },
    },
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
