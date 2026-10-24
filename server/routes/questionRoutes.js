const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/questionController');

router.use(protect);

router.get('/bookmarks', c.getBookmarks); // must come before /:id
router.route('/').get(c.getQuestions).post(adminOnly, c.createQuestion);
router.route('/:id').get(c.getQuestion).put(adminOnly, c.updateQuestion).delete(adminOnly, c.deleteQuestion);
router.post('/:id/bookmark', c.toggleBookmark);
router.post('/:id/practice', c.togglePractice);

module.exports = router;
