const Rental = require('../models/Rental');
const Clothes = require('../models/Clothes');

const createOrderId = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

exports.rentCloth = async (req, res) => {
  try {
    const { clothesId, rentalDays } = req.body;

    const cloth = await Clothes.findById(clothesId);
    if (!cloth)
      return res.status(404).json({ message: "Cloth not found" });

    // 🔒 check active rental (REAL availability check)
    const activeRental = await Rental.findOne({
      clothesId,
      status: { $ne: "returned" }
    });

    if (activeRental) {
      return res.status(400).json({
        message: "This item is currently rented by another user."
      });
    }

    const normalizedDays = Math.max(1, Number(rentalDays) || 1);
    const totalPrice = cloth.pricePerDay * normalizedDays;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + normalizedDays);

    const rental = await Rental.create({
      orderId: createOrderId(),
      userId: req.user.id,
      clothesId,
      rentalDays: normalizedDays,
      totalPrice,
      startDate,
      endDate,
      status: "active"
    });

    res.json(rental);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Rental failed" });
  }
};

exports.checkoutCart = async (req, res) => {
  const cartItems = Array.isArray(req.body?.items) ? req.body.items : [];

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const requestedClothIds = cartItems.map((item) => item.clothesId);
  const uniqueClothIds = [...new Set(requestedClothIds)];

  if (uniqueClothIds.length !== requestedClothIds.length) {
    return res.status(400).json({ message: 'Duplicate cloth items in cart' });
  }

  const clothes = await Clothes.find({ _id: { $in: uniqueClothIds } });
  const clothMap = new Map(clothes.map((cloth) => [String(cloth._id), cloth]));

  for (const item of cartItems) {
    const cloth = clothMap.get(String(item.clothesId));
    if (!cloth) {
      return res.status(404).json({ message: `Cloth not found: ${item.clothesId}` });
    }
    if (!cloth.available) {
      return res.status(400).json({ message: `${cloth.name} is not available` });
    }
  }

  const orderId = createOrderId();
  const startDate = new Date();

  const rentalPayload = cartItems.map((item) => {
    const cloth = clothMap.get(String(item.clothesId));
    const normalizedDays = Math.max(1, Number(item.rentalDays) || 1);
    const totalPrice = cloth.pricePerDay * normalizedDays;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + normalizedDays);

    return {
      orderId,
      userId: req.user.id,
      clothesId: cloth._id,
      rentalDays: normalizedDays,
      totalPrice,
      startDate,
      endDate,
    };
  });

  const rentals = await Rental.insertMany(rentalPayload);
  await Clothes.updateMany(
    { _id: { $in: uniqueClothIds } },
    { $set: { available: false } }
  );

  const totalAmount = rentals.reduce((sum, rental) => sum + rental.totalPrice, 0);

  return res.status(201).json({
    message: 'Order placed successfully',
    orderId,
    totalAmount,
    rentalCount: rentals.length,
    rentals,
  });
};

exports.myRentals = async (req, res) => {
  const rentals = await Rental
    .find({ userId: req.user.id })
    .populate('clothesId');

  res.json(rentals);
};

exports.returnCloth = async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  rental.status = 'returned';
  await rental.save();

  const cloth = await Clothes.findById(clothesId);

if (!cloth || !cloth.available)
  return res.status(400).json({ message: 'Not available' });

  res.json({ message: 'Returned successfully' });
};
