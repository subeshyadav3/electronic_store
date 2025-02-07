const express=require('express')
const router=express.Router();
const User=require('../models/customers/user');

router.get('/users',async(req,res)=>{
    try {
        const result=await User.find();
        res.status(200).json({users:result,success:true,message:'All users fetched successfully'});
    } catch (error) {
        res.status(500).json({message:'Server error',error:err})
    }
}
)


router.get('/users/:id',async(req,res)=>{
    try {
        console.log(req.params.id);
        const result=await User.findOne({_id:req.params.id});
        console.log(result);
        res.status(200).json({users:result,success:true,message:'All users fetched successfully'});
    } catch (error) {
        res.status(500).json({message:'Server error',error})
    }
}
)


router.put('/users/:id',async(req,res)=>{
    try {
    
        const result=await User.findOneAndUpdate({_id:req.params.id},{...req.body},{new:true});
        
        res.status(200).json({users:result,success:true,message:'User updated successfully'});
    } catch (error) {
        res.status(500).json({message:'Server error',error})
    }
}
)


router.delete('/users/:id',async(req,res)=>{
    try{
        const result=await User.findOneAndDelete({_id:req.params.id});
        res.status(200).json({success:true,message:'User deleted successfully'});

    }
    catch(err){
        res.status(500).json({message:'Server error',error:err})
    }
    
})

module.exports = router;