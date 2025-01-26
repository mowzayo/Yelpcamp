const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    rating: Number,
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Ensure this refers to your User model
    }
});

module.exports = mongoose.model('Review', reviewSchema);
