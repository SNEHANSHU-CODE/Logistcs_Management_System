const express = require('express');
const customerRouter = express.Router();
const Customer = require('../Model/customersModel');

customerRouter.route('/createCustomer').post(addNewCustomer);
customerRouter.route('/getCustomer').get(getCustomersDetails);
customerRouter.route('/findCustomer').get(findACustomer);
customerRouter.route('/updateCustomer').put(updateCustomerDetails);
customerRouter.route('/deleteCustomer').delete(deleteExistingCustomer);

//Add a new Customer
async function addNewCustomer(req,res){
  try {
    const newCustomer = req.body;
    if(newCustomer.name && newCustomer.city){
      const data = await Customer.create(newCustomer);
      res.status(201).json(data);
  }
  else{
    res.status(400).json({
      message : "Empty Field Found!"
    })
  }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//Get all customer details
async function getCustomersDetails(req,res){
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//Find a customer exist or not
async function findACustomer(req,res){
  try {
    const customer = await Customer.findById(req.body._id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

//Update a existing customer
async function updateCustomerDetails(req,res){
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//Delete a Existing Customer
async function deleteExistingCustomer(req,res){
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.body._id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

  
module.exports = customerRouter;