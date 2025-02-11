const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
}, { timestamps: true }); 

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
