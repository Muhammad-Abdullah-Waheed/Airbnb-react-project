const express = require("express");
const Listing = require("../Models/Listing");

const router = express.Router();

// Helper function to validate page and limit
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (pageNum < 1 || limitNum < 1) {
    throw new Error("Page and limit must be positive integers.");
  }

  return { pageNum, limitNum };
};

// Helper function to validate sort and order
const validateSortAndOrder = (sort, order) => {
  const validSortFields = ["price", "bedrooms"];
  const validOrderValues = ["asc", "desc"];

  if (!validSortFields.includes(sort)) {
    throw new Error(`Sort must be one of the following: ${validSortFields.join(", ")}`);
  }

  if (!validOrderValues.includes(order)) {
    throw new Error(`Order must be one of the following: ${validOrderValues.join(", ")}`);
  }

  return order === "desc" ? -1 : 1;
};

// Helper function to handle dynamic filtering
const buildFilterQuery = (filters) => {
  const filterQuery = {};

  if (filters.price) {
    const [minPrice, maxPrice] = filters.price.split("-").map(Number);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      throw new Error("Price filter must be in the format 'minPrice-maxPrice'");
    }
    filterQuery.price = { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_SAFE_INTEGER };
  }

  if (filters.property_type) {
    filterQuery.property_type = filters.property_type;
  }

  if (filters.bedrooms) {
    const bedrooms = parseInt(filters.bedrooms, 10);
    if (isNaN(bedrooms)) {
      throw new Error("Bedrooms filter must be a valid number.");
    }
    filterQuery.bedrooms = bedrooms;
  }

  return filterQuery;
};


router.get("/listings", async (req, res) => {
  try {
    const { page = 1, limit = 2, sort = "price", order = "asc", ...filters } = req.query;
    const { pageNum, limitNum } = validatePagination(page, limit);
    const sortOrder = validateSortAndOrder(sort, order);
    const filterQuery = buildFilterQuery(filters);

    const listings = await Listing.find(filterQuery)
      .sort({ [sort]: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalDocuments = await Listing.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalDocuments / limitNum);

    res.json({
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalListings: totalDocuments,
      },
      listings,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Error fetching listings." });
  }
});


router.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format if needed
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    res.json(listing);
  } catch (error) {
    res.status(400).json({ error: error.message || "Error fetching listing details." });
  }
});


router.get("/listings/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // Search static fields like 'address.street', 'address.suburb', or 'address.country'
    const listings = await Listing.find({
      $or: [
        { "address.street": { $regex: query, $options: "i" } },
        { "address.suburb": { $regex: query, $options: "i" } },
        { "address.country": { $regex: query, $options: "i" } },
      ],
    });

    res.json(listings);
  } catch (error) {
    res.status(400).json({ error: error.message || "Error performing search." });
  }
});


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

