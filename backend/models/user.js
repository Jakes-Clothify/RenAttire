const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, default: 'user' } // 'admin' for managing inventory
});
module.exports = mongoose.model('User', schema);