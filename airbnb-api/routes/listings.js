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
    throw new Error(
      `Sort must be one of the following: ${validSortFields.join(", ")}`
    );
  }

  if (!validOrderValues.includes(order)) {
    throw new Error(
      `Order must be one of the following: ${validOrderValues.join(", ")}`
    );
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
    filterQuery.price = {
      $gte: minPrice || 0,
      $lte: maxPrice || Number.MAX_SAFE_INTEGER,
    };
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
    const {
      page = 1,
      limit = 2,
      sort = "price",
      order = "asc",
      ...filters
    } = req.query;
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
    res
      .status(400)
      .json({ error: error.message || "Error fetching listings." });
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
    res
      .status(400)
      .json({ error: error.message || "Error fetching listing details." });
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
    res
      .status(400)
      .json({ error: error.message || "Error performing search." });
  }
});

// POST /api/admin/listings
router.post("/listings", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      UserEmail,
      Title,
      name,
      summary,
      space,
      description,
      neighborhood_overview,
      property_type,
      room_type,
      check_out_time,
      check_in_time,
      bed_type,
      minimum_nights,
      maximum_nights,
      cancellation_policy,
      accommodates,
      bedrooms,
      beds,
      bathrooms,
      price,
      amenities,
      address,
      host,
      images,
    } = req.body;

    // Create a new listing object
    const newListing = new Listing({
      UserEmail,
      Title,
      name,
      summary,
      space,
      description,
      neighborhood_overview,
      property_type,
      room_type,
      check_out_time,
      check_in_time,
      bed_type,
      minimum_nights,
      maximum_nights,
      cancellation_policy,
      accommodates,
      bedrooms,
      beds,
      bathrooms,
      price,
      amenities,
      address,
      host,
      images,
    });

    // Save the listing to the database
    const savedListing = await newListing.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: savedListing,
    });
  } catch (error) {
    console.error("Error creating listing:", error.message);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the listing",
      error: error.message,
    });
  }
});

// PUT /api/admin/listings/update/:userEmail
router.put("/listings/update/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params; // Get the user email from the URL
    const updateData = req.body; // Get the updated data from the request body

    // Find the listing by UserEmail and update it
    const updatedListing = await Listing.findOneAndUpdate(
      { UserEmail: userEmail }, // Search for the listing by UserEmail
      updateData, // The new data to update the listing
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found for this email",
      });
    }

    // Send the updated listing as the response
    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error.message);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the listing",
      error: error.message,
    });
  }
});


// DELETE /api/admin/listings/delete/:userEmail
router.delete("/listings/delete/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params; // Get the user email from the URL

    // Find the listing by UserEmail and delete it
    const deletedListing = await Listing.findOneAndDelete({ UserEmail: userEmail });

    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found for this email",
      });
    }

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error.message);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the listing",
      error: error.message,
    });
  }
});










module.exports = router;
