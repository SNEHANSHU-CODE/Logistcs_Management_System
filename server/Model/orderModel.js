const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  price: Number,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' 
  },
  deliveryVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryVehicle'
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
});

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const latestOrder = await this.constructor.findOne({}, {}, { sort: { orderNumber: -1 } });
    this.orderNumber = (latestOrder ? latestOrder.orderNumber : 0) + 1;
  }
  next();
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
