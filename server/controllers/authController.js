const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');

  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) throw new ApiError(409, 'An account with this email already exists');

  // role is never taken from the request body - new accounts are always "user"
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: generateToken(user._id), user });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  res.json({ token: generateToken(user._id), user });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, targetRole, bio } = req.body;
  if (name !== undefined) req.user.name = name;
  if (targetRole !== undefined) req.user.targetRole = targetRole;
  if (bio !== undefined) req.user.bio = bio;
  await req.user.save();
  res.json({ user: req.user });
});

// PUT /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Enter your current and new password');
  if (newPassword.length < 6) throw new ApiError(400, 'New password must be at least 6 characters');

  const user = await User.findById(req.user._id).select('+password');
  // 400 (not 401) so the client doesn't treat a typo as an expired session
  if (!(await user.matchPassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

module.exports = { register, login, getMe, updateProfile, changePassword };
