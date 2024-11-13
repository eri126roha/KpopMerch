// routes/api/merchRouter.js
const express = require('express');
const Merchandise = require('../../models/Merchandise'); // Updated path to reflect new model name
const router = express.Router();

// POST endpoint to create merchandise
router.post('/', async (req, res) => {
    const { name, description, price, imageUrl, sellerId } = req.body;

    try {
        const newMerch = new Merchandise({ name, description, price, imageUrl, seller: sellerId });
        await newMerch.save();
        res.status(201).json(newMerch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Additional routes can be added here

module.exports = router;
