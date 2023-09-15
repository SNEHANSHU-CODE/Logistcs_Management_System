const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { 
    type: String,
    unique: true 
  },
  vehicleType: {
    type: String, 
    enum: ['van', 'truck' , 'trailer'] 
  },
  city: String,
  activeOrdersCount: {
    type: Number,
    default: 0 ,
    max: 2
  },
});

const delhiveryVehiclesModel = mongoose.model('DeliveryVehicle', vehicleSchema);

module.exports = delhiveryVehiclesModel;
