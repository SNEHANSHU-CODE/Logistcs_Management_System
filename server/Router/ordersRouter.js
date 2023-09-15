const express = require('express');
const orderRouter = express.Router();
const Order = require('../Model/orderModel');
const Customer = require('../Model/customersModel');
const DeliveryVehicle = require('../Model/delhiveryVehiclesModel');
const Item = require('../Model/itemsModel');

orderRouter.route('/placeOrder').post(PlaceAOrder);
orderRouter.route('/getOrder').get(getAllOrdersDetails);
orderRouter.route('/findOrder').get(findAOrderDetails);
orderRouter.route('/modifyOrder').put(modifyAOrderDetails);
orderRouter.route('/cancelOrder').delete(deleteOrderDetails);


// Define your order-related routes here// Create an order
async function PlaceAOrder(req,res){
  try {
    const { itemId, customerId } = req.body;

    // Check if the item and customer exist
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Find a suitable delivery vehicle
    const suitableVehicle = await DeliveryVehicle.findOne({ city: customer.city, activeOrdersCount: { $lt: 2 } });
    if (!suitableVehicle) {
      return res.status(400).json({ error: 'No suitable delivery vehicle available' });
    }

    // Create the order
    const newOrder = await Order.create({
      itemId,
      price: item.price,
      customerId,
      deliveryVehicleId: suitableVehicle._id,
    });

    // Update the activeOrdersCount for the assigned delivery vehicle
    suitableVehicle.activeOrdersCount += 1;
    await suitableVehicle.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Read all orders
async function getAllOrdersDetails(req,res){
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

// Read order by ID
async function findAOrderDetails(req,res){
  try {
    const order = await Order.findById(req.body._id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
  
// Mark order as delivered
async function modifyAOrderDetails(req,res){
  try {
    const order = await Order.findById(req.body._id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.isDelivered) {
      return res.status(400).json({ error: 'Order is already delivered' });
    }

    order.isDelivered = true;
    await order.save();

    // Decrement activeOrdersCount for the delivery vehicle
    const deliveryVehicle = await DeliveryVehicle.findById(order.deliveryVehicleId);
    if (deliveryVehicle) {
      deliveryVehicle.activeOrdersCount -= 1;
      await deliveryVehicle.save();
    }

    res.json({ message: 'Order marked as delivered' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteOrderDetails(req,res){
  try {
    const order = await Order.findById(req.body._id).populate('deliveryVehicleId');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.isDelivered) {
      return res.status(400).json({ error: 'Cannot cancel a delivered order' });
    }

    // Decrement activeOrdersCount for the delivery vehicle
    if (order.deliveryVehicleId) {
      const deliveryVehicle = await DeliveryVehicle.findById(order.deliveryVehicleId);
      if (deliveryVehicle) {
        deliveryVehicle.activeOrdersCount -= 1;
        await deliveryVehicle.save();
      }
    }

    await Order.findByIdAndDelete(req.body._id);
    res.json({ message: 'Order canceled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = orderRouter;
