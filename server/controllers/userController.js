const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Experience = require('../models/Experience');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex, getPagination } = require('../utils/helpers');
const { CATEGORIES } = require('../utils/constants');

// GET /api/users/dashboard - progress summary for the logged-in user
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalQuestions, categoryTotals, practicedByCategory, attemptStats, recentAttempts, experienceCount] =
    await Promise.all([
      Question.countDocuments(),
      Question.aggregate([{ $group: { _id: '$category', total: { $sum: 1 } } }]),
      Question.aggregate([
        { $match: { _id: { $in: req.user.practiced } } },
        { $group: { _id: '$category', practiced: { $sum: 1 } } },
      ]),
      Attempt.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, count: { $sum: 1 }, average: { $avg: '$percentage' }, best: { $max: '$percentage' } } },
      ]),
      Attempt.find({ user: userId }).select('-responses').sort({ createdAt: -1 }).limit(5).lean(),
      Experience.countDocuments({ author: userId }),
    ]);

  const totalMap = Object.fromEntries(categoryTotals.map((c) => [c._id, c.total]));
  const practicedMap = Object.fromEntries(practicedByCategory.map((c) => [c._id, c.practiced]));
  const categories = CATEGORIES.filter((name) => totalMap[name]).map((name) => ({
    name,
    total: totalMap[name],
    practiced: practicedMap[name] || 0,
  }));

  const stats = attemptStats[0] || { count: 0, average: 0, best: 0 };

  res.json({
    totalQuestions,
    practicedCount: practicedByCategory.reduce((sum, c) => sum + c.practiced, 0),
    bookmarkCount: req.user.bookmarks.length,
    experienceCount,
    quizzesTaken: stats.count,
    averageScore: Math.round(stats.average || 0),
    bestScore: stats.best || 0,
    categories,
    recentAttempts,
  });
});

// ---------- Admin ----------

// GET /api/users/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
  const [users, questions, quizzes, attempts, experiences, recentUsers] = await Promise.all([
    User.countDocuments(),
    Question.countDocuments(),
    Quiz.countDocuments(),
    Attempt.countDocuments(),
    Experience.countDocuments(),
    User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  res.json({ counts: { users, questions, quizzes, attempts, experiences }, recentUsers });
});

// GET /api/users?search=&page=
const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 15);
  const filter = {};
  if (req.query.search && req.query.search.trim()) {
    const rx = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.json({
    users: users.map(({ bookmarks, practiced, __v, ...u }) => ({
      ...u,
      practicedCount: practiced.length,
      bookmarkCount: bookmarks.length,
    })),
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    total,
  });
});

// PUT /api/users/:id/role  { role: 'user' | 'admin' }
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw new ApiError(400, 'Role must be "user" or "admin"');
  if (String(req.params.id) === String(req.user._id)) throw new ApiError(400, "You can't change your own role");

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ user });
});

// DELETE /api/users/:id - also removes the user's attempts, posts and likes
const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) throw new ApiError(400, "You can't delete your own account here");

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  await Promise.all([
    Attempt.deleteMany({ user: user._id }),
    Experience.deleteMany({ author: user._id }),
    Experience.updateMany({ likes: user._id }, { $pull: { likes: user._id }, $inc: { likeCount: -1 } }),
  ]);
  res.json({ message: 'User deleted' });
});

module.exports = { getDashboard, getAdminStats, getUsers, updateUserRole, deleteUser };
