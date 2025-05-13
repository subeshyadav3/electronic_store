const User = require('../models/customers/user');
const Order = require('../models/customers/order');


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




const getCustomerOrders = async (req, res) => {
    try {
        const result = await Order.find({ user: req.params.id }).populate('user');
        res.status(200).json({ orders: result, success: true, message: 'All orders fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}



module.exports = {
    getCustomerUserUpdate,
    getCustomerUserById,
    getCustomerOrders
}

