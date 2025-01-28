const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    images: {
        type: [String],
        // type: String,
        default: [],
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        required: true,
        min: 0,
        max: 100,
    },
    discountedPrice: {
        type: Number,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    brands: {
        type: String,
        default: 'Others',
    },
    warranty: {
        type: String,
        default: 'No Warranty',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

productSchema.pre('save',function(next){
    if (this.discount > 0) {
        this.discountedPrice = this.price * (1 - this.discount / 100);
      } else {
        this.discountedPrice = this.price;
      }

    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
