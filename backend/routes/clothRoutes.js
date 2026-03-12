const router = require('express').Router();
const controller = require('../controllers/clothController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.get('/', controller.getAll);
router.get('/mine', auth, admin, controller.getMine);
router.get('/:id', controller.getOne);

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.post("/", auth, admin, uploadFields, controller.create);  // protected
router.put('/:id', auth, admin, uploadFields, controller.update); // protected
router.delete('/:id', auth, admin, controller.remove);  // protected

module.exports = router;
