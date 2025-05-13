const User = require('../models/customers/user');
const Order = require('../models/customers/order');

const getAdminUsers = async (req, res) => {
    try {
        const result = await User.find();
        res.status(200).json({ users: result, success: true, message: 'All users fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: err })
    }
}

const getAdminUsersById = async (req, res) => {
    try {
        console.log(req.params.id);
        const result = await User.findOne({ _id: req.params.id });
        console.log(result);
        res.status(200).json({ users: result, success: true, message: 'All users fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

const getAdminUsersUpdate = async (req, res) => {
    try {

        const result = await User.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true });

        res.status(200).json({ users: result, success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}


const getCustomerUserUpdate = async (req, res) => {
    try {

        const result = await User.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true });

        res.status(200).json({ users: result, success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}


const getAdminUsersDelete = async (req, res) => {
    try {
        const result = await User.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({ success: true, message: 'User deleted successfully' });

    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err })
    }
}



//for orders

const getAdminOrders = async (req, res) => {
    try {
        const result = await Order.find();
        
        res.status(200).json({ orders: result, success: true, message: 'All orders fetched successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: err })
    }
}

const getAdminOrdersById = async (req, res) => {
    try {
        console.log(req.params.id);
        const result= await Order.findOne({_id:req.params.id});
        // console.log("order",result);
        res.status(200).json({ orders: result, success: true, message: 'All orders fetched successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}

const getAdminOrdersUpdate = async (req, res) => {
    try {
        const { totalAmount, discount, priceAtPurchase, street, city, state=null, postalCode=null,status='pending',country='Nepal' } = req.body;

        if(!totalAmount || !discount || !priceAtPurchase || !street || !city ) return res.status(400).json({ message: 'All fields are required' });

        if(status !== 'pending' && status !== 'completed' && status !== 'shipped' && status !== 'delivered') return res.status(400).json({ message: 'Invalid status' });
        const updateData = {
            totalAmount,
            discount,
            priceAtPurchase,
            shippingAddress: {
                street,
                city,
                state,
                postalCode,
                country
            },
            status
        };

        if (status === 'shipped') {
            updateData.shippedDate = new Date();

        }

        const result = await Order.findOneAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true }
        );

        res.status(200).json({ orders: result, success: true, message: 'Order updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
}


module.exports = {
    getAdminUsers,
    getAdminUsersById,
    getAdminUsersUpdate,
    getAdminUsersDelete,
    getAdminOrders,
    getAdminOrdersById,
    getAdminOrdersUpdate,
    getCustomerUserUpdate
}