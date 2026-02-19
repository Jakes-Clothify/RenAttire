const mongoose = require('mongoose');
const sizeSchema = new mongoose.Schema({
  measurements: {
    type: Map,
    of: Number
  }
}, { _id: false });

const schema = new mongoose.Schema({
  name: String,
  pricePerDay: Number,
  image: String,
  available: Boolean,
  availableSizes: [sizeSchema],
});
module.exports = mongoose.model('Clothes', schema);