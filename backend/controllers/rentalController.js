const Rental = require("../models/Rental");
const Clothes = require("../models/Clothes");

const createOrderId = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

exports.createRental = async (req, res) => {
  try {
    const { clothesId, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date input" });
    }

    if (start >= end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const conflict = await Rental.findOne({
      clothesId,
      status: { $ne: "returned" },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "This item is already booked for selected dates" });
    }

    const cloth = await Clothes.findById(clothesId);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.max(1, Math.ceil((end - start) / msPerDay));

    const rental = await Rental.create({
      clothesId,
      userId: req.user._id,
      rentalDays,
      totalPrice: rentalDays * cloth.pricePerDay,
      startDate: start,
      endDate: end,
      status: "active",
    });

    await Clothes.findByIdAndUpdate(clothesId, { available: false });

    res.status(201).json(rental);
  } catch (err) {
    console.error("RENTAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const cartItems = Array.isArray(req.body?.items) ? req.body.items : [];

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const requestedClothIds = cartItems.map((item) => item.clothesId);
    const uniqueClothIds = [...new Set(requestedClothIds)];

    const clothes = await Clothes.find({ _id: { $in: uniqueClothIds } });
    const clothMap = new Map(clothes.map((c) => [String(c._id), c]));

    if (clothes.length !== uniqueClothIds.length) {
      return res.status(400).json({ message: "One or more items are invalid" });
    }

    const orderId = createOrderId();
    const rentalPayload = [];

    for (const item of cartItems) {
      const cloth = clothMap.get(String(item.clothesId));
      const providedStart = item.startDate ? new Date(item.startDate) : new Date();
      const providedEnd = item.endDate ? new Date(item.endDate) : null;

      if (Number.isNaN(providedStart.getTime())) {
        return res.status(400).json({ message: "Invalid start date in cart" });
      }

      let startDate = new Date(providedStart);
      let endDate = providedEnd && !Number.isNaN(providedEnd.getTime()) ? new Date(providedEnd) : new Date(providedStart);
      if (!providedEnd) {
        endDate.setDate(endDate.getDate() + Math.max(1, Number(item.rentalDays) || 1));
      }

      if (startDate >= endDate) {
        return res.status(400).json({ message: "Invalid date range in cart" });
      }

      const conflict = await Rental.findOne({
        clothesId: cloth._id,
        status: { $ne: "returned" },
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      }).select("_id");

      if (conflict) {
        return res.status(400).json({ message: `${cloth.name} is already booked for the selected dates` });
      }

      const rentalDays = Math.max(
        1,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      rentalPayload.push({
        orderId,
        userId: req.user._id,
        clothesId: cloth._id,
        rentalDays,
        totalPrice: cloth.pricePerDay * rentalDays,
        startDate,
        endDate,
      });
    }

    const rentals = await Rental.insertMany(rentalPayload);

    await Clothes.updateMany(
      { _id: { $in: uniqueClothIds } },
      { $set: { available: false } }
    );

    res.status(201).json({ rentals, orderId });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.myRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      userId: req.user._id
    }).populate("clothesId");

    res.json(rentals);
  } catch (err) {
    console.error("MY RENTALS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.returnCloth = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    rental.status = "returned";
    await rental.save();

    const remainingActiveRental = await Rental.findOne({
      clothesId: rental.clothesId,
      status: { $ne: "returned" },
      _id: { $ne: rental._id },
    }).select("_id");

    await Clothes.findByIdAndUpdate(rental.clothesId, { available: !remainingActiveRental });

    res.json({ message: "Returned successfully" });
  } catch (err) {
    console.error("RETURN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookedDates = async (req, res) => {
  try {
    const rentals = await Rental.find({
      clothesId: req.params.clothesId,
      status: { $ne: "returned" },
    }).select("startDate endDate");

    res.json(rentals);
  } catch (err) {
    console.error("BOOKED DATES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("clothesId")
      .populate("userId", "name email");

    res.json(rentals);
  } catch (err) {
    console.error("ADMIN RENTALS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
