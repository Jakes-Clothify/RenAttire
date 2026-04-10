const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Clothes = require('../models/Clothes');

exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    city,
    bio,
    role,
    companyName,
    businessType,
    gstNumber,
    officeAddress,
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const safeRole = role === 'admin' ? 'admin' : 'user';

  const user = await User.create({
    name: (name || '').trim(),
    email: (email || '').trim().toLowerCase(),
    password: hashed,
    phone: (phone || '').trim(),
    city: (city || '').trim(),
    bio: (bio || '').trim(),
    role: safeRole,
    companyName: safeRole === 'admin' ? (companyName || '').trim() : '',
    businessType: safeRole === 'admin' ? (businessType || '').trim() : '',
    gstNumber: safeRole === 'admin' ? (gstNumber || '').trim() : '',
    officeAddress: safeRole === 'admin' ? (officeAddress || '').trim() : '',
  });

  res.json({
    message: 'Registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      bio: user.bio,
      companyName: user.companyName,
      businessType: user.businessType,
      gstNumber: user.gstNumber,
      officeAddress: user.officeAddress,
    }
  });
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email: (email || '').trim().toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  if ((role === 'admin' || role === 'user') && user.role !== role) {
    return res.status(401).json({ message: `This account is registered as a ${user.role}` });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.json({ token });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};

exports.updateMe = async (req, res) => {
  const { name, phone, city, bio, address, companyName, businessType, gstNumber, officeAddress } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = (name ?? user.name ?? '').trim();
  user.phone = (phone ?? user.phone ?? '').trim();
  user.city = (city ?? user.city ?? '').trim();
  user.bio = (bio ?? user.bio ?? '').trim();
  if (user.role === 'admin') {
    user.companyName = (companyName ?? user.companyName ?? '').trim();
    user.businessType = (businessType ?? user.businessType ?? '').trim();
    user.gstNumber = (gstNumber ?? user.gstNumber ?? '').trim();
    user.officeAddress = (officeAddress ?? user.officeAddress ?? '').trim();
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      address: user.address,
      bio: user.bio,
      role: user.role,
      companyName: user.companyName,
      businessType: user.businessType,
      gstNumber: user.gstNumber,
      officeAddress: user.officeAddress,
    }
  });
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('wishlist')
    .select('wishlist')
    .lean();

  const items = Array.isArray(user?.wishlist) ? user.wishlist : [];
  const normalized = items.map((item) => ({
    ...item,
    images:
      Array.isArray(item.images) && item.images.length
        ? item.images
        : item.image
          ? [item.image]
          : [],
  }));

  res.json({ items: normalized });
};

exports.toggleWishlist = async (req, res) => {
  const { clothId } = req.params;

  const cloth = await Clothes.findById(clothId).select('_id');
  if (!cloth) return res.status(404).json({ message: 'Product not found' });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const exists = user.wishlist.some((item) => String(item) === String(clothId));
  if (exists) {
    user.wishlist = user.wishlist.filter((item) => String(item) !== String(clothId));
  } else {
    user.wishlist.push(clothId);
  }

  await user.save();

  res.json({
    message: exists ? 'Removed from wishlist' : 'Added to wishlist',
    saved: !exists,
    wishlist: user.wishlist,
  });
};
