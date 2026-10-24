const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { pick } = require('../utils/helpers');

const EDITABLE = ['title', 'description', 'category', 'difficulty', 'timeLimit', 'questions', 'isPublished'];

// Never send correct answers to someone taking the quiz
const stripAnswers = (quiz) => ({
  ...quiz,
  questions: quiz.questions.map(({ _id, question, options }) => ({ _id, question, options })),
});

const canView = (quiz, user) => quiz && (quiz.isPublished || user.role === 'admin');

// GET /api/quizzes?category=&difficulty=
const getQuizzes = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const [quizzes, best] = await Promise.all([
    Quiz.find(filter).sort({ createdAt: -1 }).lean(),
    Attempt.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$quiz', best: { $max: '$percentage' }, attempts: { $sum: 1 } } },
    ]),
  ]);

  const bestMap = Object.fromEntries(best.map((b) => [String(b._id), b]));
  res.json({
    quizzes: quizzes.map(({ questions, ...quiz }) => ({
      ...quiz,
      questionCount: questions.length,
      bestScore: bestMap[String(quiz._id)]?.best ?? null,
      attempts: bestMap[String(quiz._id)]?.attempts || 0,
    })),
  });
});

// GET /api/quizzes/:id  (questions without answers)
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean();
  if (!canView(quiz, req.user)) throw new ApiError(404, 'Quiz not found');
  res.json({ quiz: stripAnswers(quiz) });
});

// POST /api/quizzes/:id/submit  { answers: [index|null], timeTaken: seconds }
const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean();
  if (!canView(quiz, req.user)) throw new ApiError(404, 'Quiz not found');

  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const maxSeconds = quiz.timeLimit * 60;
  const timeTaken = Math.min(Math.max(0, Math.round(Number(req.body.timeTaken) || 0)), maxSeconds);

  const responses = quiz.questions.map((q, i) => {
    const raw = answers[i];
    const selectedIndex = Number.isInteger(raw) && raw >= 0 && raw < q.options.length ? raw : -1;
    return {
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      selectedIndex,
      isCorrect: selectedIndex === q.correctIndex,
      explanation: q.explanation,
    };
  });

  const score = responses.filter((r) => r.isCorrect).length;
  const total = responses.length;
  const percentage = Math.round((score / total) * 100);

  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    quizTitle: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    responses,
    score,
    total,
    percentage,
    timeTaken,
  });

  res.status(201).json({ attemptId: attempt._id, score, total, percentage });
});

// GET /api/quizzes/attempts/me
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id }).select('-responses').sort({ createdAt: -1 }).lean();
  res.json({ attempts });
});

// GET /api/quizzes/attempts/:attemptId
const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId).lean();
  if (!attempt) throw new ApiError(404, 'Result not found');
  if (String(attempt.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only view your own results');
  }
  res.json({ attempt });
});

// ---------- Admin ----------

// GET /api/quizzes/admin/all
const getAllQuizzesAdmin = asyncHandler(async (req, res) => {
  const [quizzes, counts] = await Promise.all([
    Quiz.find().sort({ createdAt: -1 }).lean(),
    Attempt.aggregate([{ $group: { _id: '$quiz', count: { $sum: 1 } } }]),
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  res.json({
    quizzes: quizzes.map(({ questions, ...quiz }) => ({
      ...quiz,
      questionCount: questions.length,
      attemptCount: countMap[String(quiz._id)] || 0,
    })),
  });
});

// GET /api/quizzes/:id/full (admin - includes answers, for editing)
const getQuizFull = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean();
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  res.json({ quiz });
});

// POST /api/quizzes (admin)
const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create({ ...pick(req.body, EDITABLE), createdBy: req.user._id });
  res.status(201).json({ quiz });
});

// PUT /api/quizzes/:id (admin) - uses save() so subdocument validators run correctly
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  Object.assign(quiz, pick(req.body, EDITABLE));
  await quiz.save();
  res.json({ quiz });
});

// DELETE /api/quizzes/:id (admin) - past attempts are kept as snapshots
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  res.json({ message: 'Quiz deleted' });
});

module.exports = {
  getQuizzes,
  getQuiz,
  submitQuiz,
  getMyAttempts,
  getAttempt,
  getAllQuizzesAdmin,
  getQuizFull,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
