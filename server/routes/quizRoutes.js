const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/quizController');

router.use(protect);

// Static paths first so they aren't captured by /:id
router.get('/attempts/me', c.getMyAttempts);
router.get('/attempts/:attemptId', c.getAttempt);
router.get('/admin/all', adminOnly, c.getAllQuizzesAdmin);

router.route('/').get(c.getQuizzes).post(adminOnly, c.createQuiz);
router.get('/:id/full', adminOnly, c.getQuizFull);
router.post('/:id/submit', c.submitQuiz);
router.route('/:id').get(c.getQuiz).put(adminOnly, c.updateQuiz).delete(adminOnly, c.deleteQuiz);

module.exports = router;
