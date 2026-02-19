const router = require('express').Router();
const controller = require('../controllers/rentalController');
const Rental = require("../models/Rental");
const Clothes = require("../models/Clothes");
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.rentCloth);
router.post('/checkout', auth, controller.checkoutCart);
router.get('/my', auth, controller.myRentals);
router.put("/return/:id", auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    rental.status = "returned";
    await rental.save();

    // make cloth available again
    await Clothes.findByIdAndUpdate(rental.clothesId, { available: true });

    res.json({ message: "Item returned" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/clear-history", auth, async (req, res) => {
  try {
    await Rental.deleteMany({
      userId: req.user.id,
      status: "returned"
    });

    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
