const mongoose = require('mongoose');

// Define the Merchandise Schema
const MerchandiseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true, 
    },
    price: {
        type: Number,
        required: true, 
        min: 0, 
    },
    imageUrl: {
        type: String, 
        required: true, 
    },
    category: {
        type: String, 
    },
    stock: {
        type: Number,
        default: 0, 
        min: 0, 
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Assuming you have a User model
        
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

// Create a model based on this schema
const Merchandise = mongoose.model('Merchandise', MerchandiseSchema);
module.exports = Merchandise;
