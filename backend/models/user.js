const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  address: {type: String, default: "",},
  bio: { type: String, default: '' },
  companyName: { type: String, default: '' },
  businessType: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  officeAddress: { type: String, default: '' },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clothes'
  }],
  role: { type: String, default: 'user' } // 'admin' for managing inventory
});
module.exports = mongoose.model('User', schema);
