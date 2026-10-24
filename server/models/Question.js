const mongoose = require('mongoose');
const { CATEGORIES, DIFFICULTIES } = require('../utils/constants');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [500, 'Question must be 500 characters or fewer'],
    },
    answer: { type: String, required: [true, 'A model answer is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    difficulty: { type: String, enum: DIFFICULTIES, default: 'Medium' },
    tags: [{ type: String, trim: true, lowercase: true }],
    company: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

questionSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
