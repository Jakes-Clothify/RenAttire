const mongoose = require('mongoose');
const clothSchema = new mongoose.Schema({
  name: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    default: ""
  },
  detailedDescription: {
    type: String,
    default: ""
  },
  brand: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: ""
  },
  fabric: {
    type: String,
    default: ""
  },
  occasion: {
    type: String,
    default: ""
  },
  careInstructions: {
    type: String,
    default: ""
  },
  highlights: {
    type: [String],
    default: []
  },
  pricePerDay: Number,
  image: String,
  images: {
    type: [String],
    default: []
  },
  available: {
    type: Boolean,
    default: true
  },

  type: {
    type: String,
    required: true
  },

  fitProfile: {
    type: String,
    required: true,
    enum: ["upper", "lower", "full", "footwear", "free"]
  },

  availableSizes: [
    {
      measurements: Object
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Clothes", clothSchema);
