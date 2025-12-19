const User = require('../models/customers/user');
const Order = require('../models/customers/order');
const mongoose = require('mongoose');

const express = require('express');
const router=express.Router();



const getCustomerUserUpdate = async (req, res) => {
    try {

        const result = await User.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true });

        res.status(200).json({ users: result, success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}


const getCustomerUserById = async (req, res) => {
    try {
        console.log(req.params.id);
        const result = await User.findOne({ _id: req.params.id });
        console.log(result);
        res.status(200).json({ users: result, success: true, message: 'All users fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}



// Get all orders for the authenticated customer
const getCustomerOrders = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(400).json({ message: 'User not authenticated' });
  
      const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('products.productId', 'title price brand thumbnail')
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, orders, message: 'All orders fetched successfully' });
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };
  
  // Get a specific order by ID for the authenticated customer
  const getCustomerOrderById = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { orderId } = req.params;
  
      if (!userId) return res.status(400).json({ message: 'User not authenticated' });
      if (!orderId) return res.status(400).json({ message: 'Order ID is required' });
  
      const order = await Order.findOne({ _id: orderId, userId:new mongoose.Types.ObjectId(userId) })
        .populate('products.productId', 'title price brand thumbnail');
  
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      res.status(200).json({ success: true, order, message: 'Order fetched successfully' });
    } catch (err) {
      console.error('Error fetching customer order by ID:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };


module.exports = {
    getCustomerUserUpdate,
    getCustomerUserById,
    getCustomerOrders,
    getCustomerOrderById
}

