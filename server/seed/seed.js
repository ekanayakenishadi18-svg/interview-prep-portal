// Usage:  npm run seed          -> wipe and load sample data
//         npm run seed:destroy  -> wipe all data
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Experience = require('../models/Experience');
const data = require('./data');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany(),
    Question.deleteMany(),
    Quiz.deleteMany(),
    Attempt.deleteMany(),
    Experience.deleteMany(),
  ]);
  console.log('Existing data removed');

  if (process.argv.includes('-d')) return;

  // create() (not insertMany) so the password-hashing hook runs
  const [admin, student, student2] = await User.create(data.users);

  const questions = await Question.insertMany(data.questions.map((q) => ({ ...q, createdBy: admin._id })));
  await Quiz.insertMany(data.quizzes.map((q) => ({ ...q, createdBy: admin._id })));

  // Give the demo student some progress so the dashboard isn't empty
  student.practiced = questions.filter((_, i) => i % 3 === 0).map((q) => q._id);
  student.bookmarks = [questions[2]._id, questions[13]._id, questions[18]._id];
  await student.save();

  const authors = [student2, student2, student];
  await Experience.insertMany(
    data.experiences.map((e, i) => {
      const likes = i === 0 ? [student._id, admin._id] : i === 1 ? [student._id] : [];
      return { ...e, author: authors[i]._id, likes, likeCount: likes.length };
    })
  );

  console.log(`Seeded ${data.users.length} users, ${questions.length} questions, ${data.quizzes.length} quizzes, ${data.experiences.length} experiences`);
  console.log('Admin login:   admin@prep.dev / Admin@123');
  console.log('Student login: student@prep.dev / Student@123');
};

run()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
