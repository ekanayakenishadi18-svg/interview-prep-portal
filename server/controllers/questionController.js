const Question = require('../models/Question');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex, getPagination, pick, normalizeTags } = require('../utils/helpers');

const EDITABLE = ['title', 'answer', 'category', 'difficulty', 'tags', 'company'];

// GET /api/questions?category=&difficulty=&search=&status=practiced|pending|bookmarked&page=&limit=
const getQuestions = asyncHandler(async (req, res) => {
  const { category, difficulty, search, status } = req.query;
  const { page, limit, skip } = getPagination(req.query, 10);

  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: rx }, { tags: rx }, { company: rx }];
  }
  if (status === 'practiced') filter._id = { $in: req.user.practiced };
  else if (status === 'pending') filter._id = { $nin: req.user.practiced };
  else if (status === 'bookmarked') filter._id = { $in: req.user.bookmarks };

  const [questions, total] = await Promise.all([
    Question.find(filter).select('-answer').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Question.countDocuments(filter),
  ]);

  res.json({ questions, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});

// GET /api/questions/:id
const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id).populate('createdBy', 'name');
  if (!question) throw new ApiError(404, 'Question not found');
  res.json({ question });
});

// POST /api/questions (admin)
const createQuestion = asyncHandler(async (req, res) => {
  const data = pick(req.body, EDITABLE);
  data.tags = normalizeTags(data.tags);
  const question = await Question.create({ ...data, createdBy: req.user._id });
  res.status(201).json({ question });
});

// PUT /api/questions/:id (admin)
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) throw new ApiError(404, 'Question not found');

  const data = pick(req.body, EDITABLE);
  if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
  Object.assign(question, data);
  await question.save();
  res.json({ question });
});

// DELETE /api/questions/:id (admin)
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) throw new ApiError(404, 'Question not found');
  // Remove dangling references from every user
  await User.updateMany({}, { $pull: { bookmarks: question._id, practiced: question._id } });
  res.json({ message: 'Question deleted' });
});

// Shared logic for bookmark / practiced toggles
const toggleInUserList = (field) =>
  asyncHandler(async (req, res) => {
    const exists = await Question.exists({ _id: req.params.id });
    if (!exists) throw new ApiError(404, 'Question not found');

    const has = req.user[field].some((id) => id.equals(req.params.id));
    const update = has ? { $pull: { [field]: req.params.id } } : { $addToSet: { [field]: req.params.id } };
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });

    res.json({ active: !has, [field]: user[field] });
  });

// POST /api/questions/:id/bookmark
const toggleBookmark = toggleInUserList('bookmarks');
// POST /api/questions/:id/practice
const togglePractice = toggleInUserList('practiced');

// GET /api/questions/bookmarks
const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'bookmarks', select: '-answer' });
  res.json({ questions: user.bookmarks });
});

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleBookmark,
  togglePractice,
  getBookmarks,
};
