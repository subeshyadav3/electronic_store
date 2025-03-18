const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
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
    brand: {
        type: String,
        default: 'Others',
    },
    sku: {
        type: String,
    },
    weight: {
        type: Number,
    },
    dimensions: {
        type: Object,
    },
    warrantyInformation: {
        type: String,
        default: 'No Warranty',
    },
    shippingInformation: {
        type: String,
        default: '',
    },
    availabilityStatus: {
        type: String,
        default: 'In Stock',
    },
    returnPolicy: {
        type: String,
        default: 'No Returns',
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
    },
    meta: {
        type: Object,
    },
    images: {
        type: [String],
        default: [],
    },
    thumbnail: {
        type: String,
    },
    comments: [
        {
            user: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
            },
            reply: [
                {
                    user: {
                        type: String,
                        required: true,
                    },
                    comment: {
                        type: String,
                    }
                }
            ]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

productSchema.pre('save', function (next) {
    if (this.discount > 0) {
        this.discountedPrice = this.price * (1 - this.discount / 100);
    } else {
        this.discountedPrice = this.price;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
