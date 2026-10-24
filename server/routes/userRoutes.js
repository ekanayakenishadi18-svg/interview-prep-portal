const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/userController');

router.use(protect);

router.get('/dashboard', c.getDashboard);

router.get('/admin/stats', adminOnly, c.getAdminStats);
router.get('/', adminOnly, c.getUsers);
router.put('/:id/role', adminOnly, c.updateUserRole);
router.delete('/:id', adminOnly, c.deleteUser);

module.exports = router;
