const mongoose = require('mongoose');

// Each response is a snapshot, so results stay correct even if the quiz is edited or deleted later
const responseSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctIndex: Number,
    selectedIndex: { type: Number, default: -1 }, // -1 = not answered
    isCorrect: Boolean,
    explanation: String,
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    quizTitle: String,
    category: String,
    difficulty: String,
    responses: [responseSchema],
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeTaken: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
