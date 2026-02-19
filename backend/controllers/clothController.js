const Clothes = require('../models/Clothes');
const Rentals = require('../models/Rental');


exports.getAll = async (req, res) => {
  const { q, maxPrice, size, sort, page, limit } = req.query;

  const filter = {};
  let sortOption = { _id: -1 };

  if (q) filter.name = { $regex: q, $options: 'i' };

  if (maxPrice !== undefined && maxPrice !== '') {
    const maxPriceNumber = Number(maxPrice);
    if (!Number.isNaN(maxPriceNumber)) {
      filter.pricePerDay = { $lte: maxPriceNumber };
    }
  }

  if (size) {
    filter[`availableSizes.measurements.${size}`] = { $exists: true };
  }

  if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
  else if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
  else if (sort === 'name_asc') sortOption = { name: 1 };
  else if (sort === 'name_desc') sortOption = { name: -1 };

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, Number(limit) || 9));
  const skip = (pageNumber - 1) * limitNumber;

  const [clothes, total] = await Promise.all([
    Clothes.find(filter).sort(sortOption).skip(skip).limit(limitNumber),
    Clothes.countDocuments(filter),
  ]);

  // ===== Availability Intelligence =====
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const clothIds = clothes.map(c => c._id);

  const activeRentals = await Rentals.find({
    clothesId: { $in: clothIds },
    status: { $ne: "returned" }
  });

  const rentalMap = new Map();
  activeRentals.forEach(r => rentalMap.set(String(r.clothesId), r));

  const enriched = clothes.map(c => {
    const rental = rentalMap.get(String(c._id));

    let status = "available";
    let returnDate = null;

    if (rental) {
      returnDate = rental.endDate;

      if (new Date(rental.endDate) <= soonThreshold)
        status = "returning_soon";
      else
        status = "rented";
    }

    return {
      ...c.toObject(),
      status,
      returnDate
    };
  });

  const totalPages = Math.max(1, Math.ceil(total / limitNumber));

  res.json({
    items: enriched,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages,
    },
  });
};


exports.getOne = async (req, res) => {
  const cloth = await Clothes.findById(req.params.id);
  res.json(cloth);
};

exports.create = async (req, res) => {
  const { name, pricePerDay, sizes } = req.body;

  const cloth = await Clothes.create({
    name,
    pricePerDay,
    image: `/uploads/${req.file.filename}`,
    available: true,
    availableSizes: JSON.parse(sizes)
  });

  res.json(cloth);
};

exports.remove = async (req, res) => {
  await Clothes.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};
