const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address',
        ],
    },
    
    password: {
        type: String,
        required: true,
    },
    bio:{
        type:String,
        default:''
    },
    profilePic: {
        type: String,
        default: '',
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    productsCreated:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    address: [{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    }],
    shortAddress:{
        type: String,
        default: ''
    },
    role:{
        type:String,
        enum:['customer','admin','dealer'],
        default:'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    followDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Follow'
    }],
    cart: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: { 
            type: Number, 
            default: 1 
        }
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Password hashing before saving
// userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
//   });

// // Password comparison method (for login)
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// };


// User model
const User = mongoose.model('User', userSchema);
module.exports = User;
