const router = require('express').Router();
const controller = require('../controllers/clothController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

router.post("/", auth, admin, upload.single("image"), controller.create);  // protected
router.delete('/:id', auth, admin, controller.remove);  // protected

module.exports = router;
