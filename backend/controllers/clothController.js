const Clothes = require('../models/Clothes');
const Rentals = require('../models/Rental');
const allowedFitProfiles = new Set(["upper", "lower", "full", "footwear", "free"]);

const parseHighlights = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((x) => String(x || "").trim()).filter(Boolean);
  }
  return String(input)
    .split(/\r?\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
};

const parseSizes = (raw) => {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const parseUploadedImages = (req) => {
  const cover = req.files?.image?.[0] || req.file || null;
  const extras = Array.isArray(req.files?.images) ? req.files.images : [];
  const coverPath = cover ? `/uploads/${cover.filename}` : "";
  const extraPaths = extras.map((f) => `/uploads/${f.filename}`);
  return { coverPath, extraPaths };
};

const parseImageOrder = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => String(x || "").trim()).filter(Boolean);
  } catch {
    return [];
  }
};

exports.getAll = async (req, res) => {
  const { q, maxPrice, size, sort, page, limit, available, type, occasion, fitProfile } = req.query;

  const filter = {};
  let sortOption = { _id: -1 };

  if (q) {
    const regex = { $regex: q, $options: 'i' };
    filter.$or = [
      { name: regex },
      { description: regex },
      { brand: regex },
      { color: regex },
      { fabric: regex },
      { occasion: regex },
      { type: regex },
    ];
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    const maxPriceNumber = Number(maxPrice);
    if (!Number.isNaN(maxPriceNumber)) {
      filter.pricePerDay = { $lte: maxPriceNumber };
    }
  }

  if (size) {
    filter[`availableSizes.measurements.${size}`] = { $exists: true };
  }
  if (type) filter.type = { $regex: `^${String(type).trim()}$`, $options: 'i' };
  if (occasion) filter.occasion = { $regex: occasion, $options: 'i' };
  if (fitProfile) filter.fitProfile = fitProfile;
  if (String(available).toLowerCase() === "true") filter.available = true;

  if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
  else if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
  else if (sort === 'name_asc') sortOption = { name: 1 };
  else if (sort === 'name_desc') sortOption = { name: -1 };

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, Number(limit) || 9));
  const skip = (pageNumber - 1) * limitNumber;

  const [clothes, rawTotal] = await Promise.all([
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
      images:
        Array.isArray(c.images) && c.images.length
          ? c.images
          : c.image
            ? [c.image]
            : [],
      status,
      returnDate
    };
  });

  const total = rawTotal;
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

exports.getMine = async (req, res) => {
  try {
    const items = await Clothes.find({
      $or: [{ createdBy: req.user._id }, { createdBy: { $exists: false } }, { createdBy: null }],
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items });
  } catch (err) {
    console.error("GET MY CLOTHES ERROR:", err);
    res.status(500).json({ message: "Failed to load your products" });
  }
};


exports.getOne = async (req, res) => {
  try {
    const cloth = await Clothes.findById(req.params.id).lean();
    if (!cloth) return res.status(404).json({ message: "Not found" });

    // ---- Availability logic same as getAll ----
    const now = new Date();
    const soonThreshold = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const rental = await Rentals.findOne({
      clothesId: cloth._id,
      status: { $ne: "returned" }
    });

    let status = "available";
    let returnDate = null;

    if (rental) {
      returnDate = rental.endDate;

      if (new Date(rental.endDate) <= soonThreshold)
        status = "returning_soon";
      else
        status = "rented";
    }

    const normalizedImages =
      Array.isArray(cloth.images) && cloth.images.length
        ? cloth.images
        : cloth.image
          ? [cloth.image]
          : [];

    res.json({
      ...cloth,
      images: normalizedImages,
      status,
      returnDate
    });

  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      detailedDescription,
      brand,
      color,
      fabric,
      occasion,
      careInstructions,
      highlights,
      pricePerDay,
      type,
      fitProfile,
      availableSizes,
      imageOrder,
    } = req.body;

    const parsedSizes = parseSizes(availableSizes);
    const parsedHighlights = parseHighlights(highlights);

    const safeFitProfile = allowedFitProfiles.has(fitProfile) ? fitProfile : "free";
    const safeType = (type || "Outfit").trim();
    const safePrice = Number(pricePerDay) || 0;

    const { coverPath, extraPaths } = parseUploadedImages(req);
    const imageList = [coverPath, ...extraPaths].filter(Boolean);

    const cloth = await Clothes.create({
      name,
      createdBy: req.user._id,
      description: (description || "").trim(),
      detailedDescription: (detailedDescription || "").trim(),
      brand: (brand || "").trim(),
      color: (color || "").trim(),
      fabric: (fabric || "").trim(),
      occasion: (occasion || "").trim(),
      careInstructions: (careInstructions || "").trim(),
      highlights: parsedHighlights,
      pricePerDay: safePrice,
      type: safeType,
      fitProfile: safeFitProfile,
      image: coverPath || extraPaths[0] || "",
      images: imageList,
      available: true,
      availableSizes: parsedSizes
    });

    res.json(cloth);
  } catch (err) {
    console.error("CREATE CLOTH ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to create cloth" });
  }
};

exports.update = async (req, res) => {
  try {
    const cloth = await Clothes.findById(req.params.id);
    if (!cloth) return res.status(404).json({ message: "Product not found" });

    if (cloth.createdBy && String(cloth.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can edit only products you added" });
    }
    if (!cloth.createdBy) {
      cloth.createdBy = req.user._id;
    }

    const {
      name,
      description,
      detailedDescription,
      brand,
      color,
      fabric,
      occasion,
      careInstructions,
      highlights,
      pricePerDay,
      type,
      fitProfile,
      availableSizes,
    } = req.body;

    const parsedSizes = parseSizes(availableSizes);
    const parsedHighlights = parseHighlights(highlights);

    cloth.name = (name ?? cloth.name ?? "").trim();
    cloth.description = (description ?? cloth.description ?? "").trim();
    cloth.detailedDescription = (detailedDescription ?? cloth.detailedDescription ?? "").trim();
    cloth.brand = (brand ?? cloth.brand ?? "").trim();
    cloth.color = (color ?? cloth.color ?? "").trim();
    cloth.fabric = (fabric ?? cloth.fabric ?? "").trim();
    cloth.occasion = (occasion ?? cloth.occasion ?? "").trim();
    cloth.careInstructions = (careInstructions ?? cloth.careInstructions ?? "").trim();
    const resolvedType = (type ?? cloth.type ?? "Outfit").trim();
    const resolvedFitProfile = fitProfile ?? cloth.fitProfile ?? "free";
    cloth.pricePerDay = Number(pricePerDay ?? cloth.pricePerDay ?? 0);
    cloth.type = resolvedType || "Outfit";
    cloth.fitProfile = allowedFitProfiles.has(resolvedFitProfile) ? resolvedFitProfile : "free";
    cloth.availableSizes = parsedSizes;
    cloth.highlights = parsedHighlights;

    const { coverPath, extraPaths } = parseUploadedImages(req);
    const existing = Array.isArray(cloth.images) && cloth.images.length
      ? cloth.images
      : cloth.image
        ? [cloth.image]
        : [];
    const requestedOrder = parseImageOrder(imageOrder);
    const orderedExisting = requestedOrder.length
      ? requestedOrder.filter((img) => existing.includes(img))
      : existing;

    let nextImages = orderedExisting.length ? orderedExisting : existing;

    if (coverPath) {
      nextImages = [coverPath, ...nextImages.filter((img) => img !== coverPath)];
    }
    if (extraPaths.length > 0) {
      nextImages = [...nextImages, ...extraPaths];
    }

    const deduped = [];
    const seen = new Set();
    for (const img of nextImages) {
      if (!img || seen.has(img)) continue;
      deduped.push(img);
      seen.add(img);
    }

    cloth.images = deduped;
    if (deduped.length) cloth.image = deduped[0];

    await cloth.save();
    res.json(cloth);
  } catch (err) {
    console.error("UPDATE CLOTH ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to update product" });
  }
};

exports.remove = async (req, res) => {
  const cloth = await Clothes.findById(req.params.id);
  if (!cloth) return res.status(404).json({ message: "Product not found" });

  if (cloth.createdBy && String(cloth.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can delete only products you added" });
  }

  await Clothes.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};
