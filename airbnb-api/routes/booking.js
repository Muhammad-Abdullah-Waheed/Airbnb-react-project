const express = require('express');
const {booking} = require('../Models/Booking');

const router = express.Router();


router.post("/bookings", async (req, res) => {
    try {
      const { listingId, userId, startDate, endDate } = req.body;
  
      // Validate the input data
      if (!listingId || !userId || !startDate || !endDate) {
        return res.status(400).json({ error: "All fields are required: listingId, userId, startDate, endDate." });
      }
  
      // Check if the listing exists
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found." });
      }
  
      // Mock booking logic (In a real scenario, this would involve storing data in a Bookings collection)
      const booking = {
        id: Math.random().toString(36).substring(7), // Generate a mock booking ID
        listingId,
        userId,
        startDate,
        endDate,
        status: "confirmed",
      };
  
      res.status(201).json({ message: "Booking created successfully.", booking });
    } catch (error) {
      res.status(400).json({ error: error.message || "Error creating booking." });
    }
  });



module.exports = router;