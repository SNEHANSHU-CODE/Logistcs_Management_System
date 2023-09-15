const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  city: String,
});

const customerModel = mongoose.model('Customer', customerSchema);

module.exports = customerModel;
