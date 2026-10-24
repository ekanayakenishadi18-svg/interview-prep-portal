const Experience = require('../models/Experience');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex, getPagination, pick } = require('../utils/helpers');

const EDITABLE = ['company', 'role', 'location', 'outcome', 'difficulty', 'rounds', 'content', 'tips'];

const isOwner = (experience, user) => String(experience.author._id || experience.author) === String(user._id);

// GET /api/experiences?search=&outcome=&sort=newest|oldest|popular&mine=true&page=
const getExperiences = asyncHandler(async (req, res) => {
  const { search, outcome, sort, mine } = req.query;
  const { page, limit, skip } = getPagination(req.query, 8);

  const filter = {};
  if (outcome) filter.outcome = outcome;
  if (mine === 'true') filter.author = req.user._id;
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ company: rx }, { role: rx }, { content: rx }];
  }

  const sortBy =
    sort === 'popular' ? { likeCount: -1, createdAt: -1 } : sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [experiences, total] = await Promise.all([
    Experience.find(filter).populate('author', 'name targetRole').sort(sortBy).skip(skip).limit(limit).lean(),
    Experience.countDocuments(filter),
  ]);

  res.json({ experiences, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});

// GET /api/experiences/:id
const getExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id).populate('author', 'name targetRole');
  if (!experience) throw new ApiError(404, 'Experience not found');
  res.json({ experience });
});

// POST /api/experiences
const createExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.create({ ...pick(req.body, EDITABLE), author: req.user._id });
  res.status(201).json({ experience });
});

// PUT /api/experiences/:id (author only)
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) throw new ApiError(404, 'Experience not found');
  if (!isOwner(experience, req.user)) throw new ApiError(403, 'You can only edit your own posts');

  Object.assign(experience, pick(req.body, EDITABLE));
  await experience.save();
  res.json({ experience });
});

// DELETE /api/experiences/:id (author or admin)
const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) throw new ApiError(404, 'Experience not found');
  if (!isOwner(experience, req.user) && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only delete your own posts');
  }
  await experience.deleteOne();
  res.json({ message: 'Experience deleted' });
});

// POST /api/experiences/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) throw new ApiError(404, 'Experience not found');

  const liked = experience.likes.some((id) => id.equals(req.user._id));
  if (liked) experience.likes.pull(req.user._id);
  else experience.likes.push(req.user._id);
  experience.likeCount = experience.likes.length;
  await experience.save();

  res.json({ liked: !liked, likeCount: experience.likeCount });
});

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  toggleLike,
};
