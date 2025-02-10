const express=require('express')
const router=express.Router();
const User = require('../models/customers/user');
const Order = require('../models/customers/order')

router.post('/',async(req,res)=>{   
    try{
        const {productId,quantity,totalAmount,discount,priceAtPurchase,street,city,state=null,postalCode=null}=req.body;
        
        if(!productId || !quantity || !totalAmount || !discount || !priceAtPurchase || !street || !city ) return res.status(400).json({message:"All fields are required",success:false});

        const userId=req.user.userId;
        if(!userId) return res.status(400).json({message:"User not found",success:false});

        const addToOrder= new Order({
            userId:userId,
            products:{productId:productId,quantity:quantity},
            totalAmount:totalAmount,
            discount:discount,
            priceAtPurchase:priceAtPurchase,
            shippingAddress:{
                street:street,
                city:city,
                state:state ,
                postalCode:postalCode ,
                
            },
            deliveryDate:new Date(Date.now()+7*24*60*60*1000)
        })

        addToOrder.save();

        await User.findByIdAndUpdate(userId,{$push:{orders:productId}});

        res.status(200).json({message:"Add item to cart",success:true,orders:addToOrder})
    }
    catch(err){
        console.error('Add item to cart error:', err);
        res.status(500).json({message:"Server error",success:false});
    }
}   

)



module.exports=router;