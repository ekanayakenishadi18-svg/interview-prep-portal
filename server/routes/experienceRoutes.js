const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/experienceController');

router.use(protect);

router.route('/').get(c.getExperiences).post(c.createExperience);
router.route('/:id').get(c.getExperience).put(c.updateExperience).delete(c.deleteExperience);
router.post('/:id/like', c.toggleLike);

module.exports = router;
