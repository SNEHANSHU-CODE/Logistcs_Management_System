const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const itemModel = mongoose.model('itemModel', itemSchema);

module.exports = itemModel;
