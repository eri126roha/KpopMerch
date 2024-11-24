const router = require("express").Router();
const Merchandise = require("../../models/Merchandise");
const User = require("../../models/User");  // Assuming the User model is located here

router.post("/addMerch", (req, res) => {
    // Destructure required fields from req.body
    const { name, description, price, imageUrl, category, userId } = req.body;

    // Check if any required fields are missing
    if (!name || !description || !price || !imageUrl || !category || !userId) {
        return res.status(400).json({ status: "notok", msg: "Please enter all required data" });
    }

    // Fetch the user details to get the email and phone number
    User.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ status: "notok", msg: "User not found" });
            }

            // Create a new merchandise instance
            const newMerch = new Merchandise({
                name,
                description,
                price,
                imageUrl,
                category,
                user: userId
            });

            // Save the merchandise to the database
            newMerch.save()
                .then((merch) => {
                    return res.status(200).json({
                        status: "ok",
                        msg: "Merchandise added successfully",
                        merch,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({
                        status: "error",
                        msg: "Internal server error",
                    });
                });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                status: "error",
                msg: "Error fetching user details",
            });
        });
});

module.exports = router;
