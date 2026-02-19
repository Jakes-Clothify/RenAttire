const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: { type: String, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clothesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' },
  rentalDays: Number,
  totalPrice: Number,
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, default: 'active' } // active, returned
}, { timestamps: true });

module.exports = mongoose.model('Rental', schema);
