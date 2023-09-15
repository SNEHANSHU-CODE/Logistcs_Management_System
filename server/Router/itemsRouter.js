const express = require('express');
const itemRouter = express.Router();
const Item = require('../Model/itemsModel');

itemRouter.route('/createItem').post(createItem);
itemRouter.route('/getItem').get(getItem);
itemRouter.route('/updateItem').put(updateItem);
itemRouter.route('/deleteItem').delete(deleteItem);

//Create a new Item
async function createItem(req,res){
  try {
    const newItem = req.body;
    if(newItem.name && newItem.price){
      const data = await Item.create(newItem);
      res.status(201).json(data);
    }
    else{
      res.status(400).json({
          message: "Empty field found!",
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//Get all items
async function getItem(req,res){
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
 
//Update a existing item
async function updateItem(req,res){
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//delete a existing item
async function deleteItem(req,res){
  try {
    const deletedItem = await Item.findByIdAndDelete(req.body._id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}


module.exports = itemRouter;
