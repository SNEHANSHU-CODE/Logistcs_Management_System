const express = require('express');
const DelhiveryRouter = express.Router();
const DeliveryVehicle = require('../Model/delhiveryVehiclesModel');

DelhiveryRouter.route('/addVehicle').post(addNewVehicle);
DelhiveryRouter.route('/getAllVehicle').get(getAllVehicleDetails);
DelhiveryRouter.route('/findAVehicle').get(findAVehicleDetails);
DelhiveryRouter.route('/updateVehicle').put(updateVehicleDetails);
DelhiveryRouter.route('/deleteVehicle').delete(deleteVehicleDetails);

//Add a new Vehicle to Fleet
async function addNewVehicle(req,res){
  try {
    const newVehicle = req.body;
    if(newVehicle.registrationNumber && newVehicle.vehicleType && newVehicle.city){
      const data = await DeliveryVehicle.create(newVehicle);
      res.status(201).json(data);
    }
    else{
      res.status(400).json({
        message : "Empty Field Found!",
      })
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//Get all vehicle details
async function getAllVehicleDetails(req,res){
  try {
    const vehicles = await DeliveryVehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//find a vehicle exist or not
async function findAVehicleDetails(req,res){
  try {
    const vehicle = await DeliveryVehicle.findById(req.body._id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Delivery vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//Update a existing vehicle details
async function updateVehicleDetails(req,res){
  try {
    const updatedVehicle = await DeliveryVehicle.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Delivery vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//Delete a existing vehicle
async function deleteVehicleDetails(req,res){
  try {
    const deletedVehicle = await DeliveryVehicle.findByIdAndDelete(req.body._id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Delivery vehicle not found' });
    }
    res.json({ message: 'Delivery vehicle deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = DelhiveryRouter;
