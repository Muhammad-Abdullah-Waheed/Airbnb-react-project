const express = require("express");
const Listing = require("../Models/Listing");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// --------- Helpers ---------

const validatePagination = (page, limit) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (
    Number.isNaN(pageNum) ||
    Number.isNaN(limitNum) ||
    pageNum < 1 ||
    limitNum < 1
  ) {
    throw new Error("Page and limit must be positive integers.");
  }

  return { pageNum, limitNum };
};

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

// Escape user-provided strings so they cannot break out of a regex. Without
// this, a user could pass `.*` and match anything, or `(a+)+` to trigger a
// ReDoS attack.
const escapeRegex = (str) =>
  String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilterQuery = (filters) => {
  const filterQuery = {};

  if (filters.price) {
    const [minPrice, maxPrice] = filters.price.split("-").map(Number);
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice)) {
      throw new Error(
        "Price filter must be in the format 'minPrice-maxPrice'"
      );
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
    if (Number.isNaN(bedrooms)) {
      throw new Error("Bedrooms filter must be a valid number.");
    }
    filterQuery.bedrooms = bedrooms;
  }

  return filterQuery;
};

// --------- Public GET routes ---------

router.get("/listings", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 4,
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

    return res.json({
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalListings: totalDocuments,
      },
      listings,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "Error fetching listings." });
  }
});

router.get("/getlistings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    return res.json(listing);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "Error fetching listing details." });
  }
});

// Fetch listings by the owner's email. Kept public to keep existing frontend
// behavior working — tighten to `verifyToken` + owner check if needed.
router.get("/listings/:userEmail", async (req, res) => {
  try {
    const userEmail = String(req.params.userEmail).toLowerCase().trim();

    const listings = await Listing.find({ UserEmail: userEmail });

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No listings found for this email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listings fetched successfully",
      listings,
    });
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the listings",
      error: error.message,
    });
  }
});

router.get("/listings/search/:location", async (req, res) => {
  try {
    const { location: query } = req.params;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    const safeQuery = escapeRegex(query);

    const listings = await Listing.find({
      $or: [
        { "address.street": { $regex: safeQuery, $options: "i" } },
        { "address.suburb": { $regex: safeQuery, $options: "i" } },
        { "address.country": { $regex: safeQuery, $options: "i" } },
      ],
    });

    if (listings.length === 0) {
      return res
        .status(404)
        .json({ message: "No listings found for the given location." });
    }

    return res.json(listings);
  } catch (error) {
    console.error("Error in search function:", error);
    return res
      .status(400)
      .json({ error: error.message || "Error performing search." });
  }
});

// --------- Protected mutations ---------

// Only authenticated users can create a listing. The UserEmail on the listing
// is always taken from the verified token, never from the request body, so
// users cannot create listings under someone else's email.
router.post("/listings", verifyToken, async (req, res) => {
  try {
    const {
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

    const newListing = new Listing({
      UserEmail: req.user.email,
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

    const savedListing = await newListing.save();

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing: savedListing,
    });
  } catch (error) {
    console.error("Error creating listing:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the listing",
      error: error.message,
    });
  }
});

router.put("/listings/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const isOwner = req.user.email === listing.UserEmail;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this listing",
      });
    }

    // Never let a client change ownership on update.
    delete updatedData.UserEmail;

    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the listing",
      error: error.message,
    });
  }
});

router.delete(
  "/listings/delete/:listingId",
  verifyToken,
  async (req, res) => {
    try {
      const { listingId } = req.params;
      const listing = await Listing.findById(listingId);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      const isOwner = req.user.email === listing.UserEmail;
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this listing",
        });
      }

      await Listing.findByIdAndDelete(listingId);

      return res.status(200).json({
        success: true,
        message: "Listing deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting listing:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the listing",
        error: error.message,
      });
    }
  }
);

module.exports = router;
