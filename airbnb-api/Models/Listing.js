// models/Listing.js
const mongoose = require("mongoose");


// airbnbListingSchema.js

// const airbnbListingSchema = {
//     owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
//     UserEmail:"string",
//     photos:["string"],
//     listing_url: "string",
//     check_in_time: "string",
//     check_out_time: "string",
//     name: "string",
//     summary: "string",
//     space: "string",
//     description: "string",
//     neighborhood_overview: "string",
//     notes: "string",
//     transit: "string",
//     access: "string",
//     interaction: "string",
//     house_rules: "string",
//     property_type: "string",
//     room_type: "string",
//     bed_type: "string",
//     minimum_nights: "string",
//     maximum_nights: "string",
//     cancellation_policy: "string",
//     last_scraped: "date",
//     calendar_last_scraped: "date",
//     first_review: "date",
//     last_review: "date",
//     accommodates: "number",
//     bedrooms: "number",
//     beds: "number",
//     number_of_reviews: "number",
//     bathrooms: "number",
//     amenities: ["string"],
//     price: "number",
//     security_deposit: "number",
//     cleaning_fee: "number",
//     extra_people: "number",
//     guests_included: "number",
//     images: {
//       thumbnail_url: "string",
//       medium_url: "string",
//       picture_url: "string",
//       xl_picture_url: "string",
//     },
//     host: {
//       host_id: "string",
//       host_url: "string",
//       host_name: "string",
//       host_location: "string",
//       host_about: "string",
//       host_response_time: "string",
//       host_thumbnail_url: "string",
//       host_picture_url: "string",
//       host_neighbourhood: "string",
//       host_response_rate: "number",
//       host_is_superhost: "boolean",
//       host_has_profile_pic: "boolean",
//       host_identity_verified: "boolean",
//       host_listings_count: "number",
//       host_total_listings_count: "number",
//       host_verifications: ["string"],
//     },
//     address: {
//       street: "string",
//       suburb: "string",
//       government_area: "string",
//       market: "string",
//       country: "string",
//       country_code: "string",
//       location: {
//         type: "string",
//         coordinates: ["number"],
//         is_location_exact: "boolean",
//       },
//     },
//     availability: {
//       availability_30: "number",
//       availability_60: "number",
//       availability_90: "number",
//       availability_365: "number",
//     },
//     review_scores: {
//       review_scores_accuracy: "number",
//       review_scores_cleanliness: "number",
//       review_scores_checkin: "number",
//       review_scores_communication: "number",
//       review_scores_location: "number",
//       review_scores_value: "number",
//       review_scores_rating: "number",
//     },
//     reviews: [
//       {
//         _id: "string",
//         date: "date",
//         listing_id: "string",
//         reviewer_id: "string",
//         reviewer_name: "string",
//         comments: "string",
//       },
//     ],
//   };
  
  const ListingSchema = new mongoose.Schema({
    UserEmail: { type: String, required: true }, // User email (required)
    Title: { type: String, required: true }, // Listing title
    name: { type: String, required: true }, // Name of the listing
    summary: { type: String }, // Short summary
    space: { type: String }, // Description of the space
    description: { type: String }, // Full description
    neighborhood_overview: { type: String }, // Overview of the neighborhood
    property_type: { type: String, required: true }, // Type of property
    room_type: { type: String, required: true }, // Type of room
    check_out_time: { type: String }, // Checkout time
    check_in_time: { type: String }, // Check-in time
    bed_type: { type: String }, // Type of bed
    minimum_nights: { type: Number, default: 1 }, // Minimum nights required
    maximum_nights: { type: Number, default: 365 }, // Maximum nights allowed
    cancellation_policy: { type: String }, // Cancellation policy
    accommodates: { type: Number }, // Number of people it accommodates
    bedrooms: { type: Number, required: true }, // Number of bedrooms
    beds: { type: Number }, // Number of beds
    bathrooms: { type: Number }, // Number of bathrooms
    price: { type: Number, required: true }, // Price per night
    amenities: [{ type: String }], // List of amenities
    address: { 
      type: Object, 
      required: true, 
      default: {}
    }, // Address object
    host: {
      type: Object,
      default: {},
    }, // Host details (can be nested object)
    images: [{ type: String }], // Array of image URLs
  }, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

// const ListingSchema = new mongoose.Schema({
//     _id: Number,
//   name: String,
//   summary: String,
//   property_type: String,
//   bedrooms: Number,
//   bathrooms: Number,
//   price: Number,
//   address: {
//     street: String,
//     suburb: String,
//     country: String,
//   },
//   amenities: [String],
//   images: {
//     picture_url: String,
//   },
// });


// module.exports = mongoose.model('airnb_sample', airbnbListingSchema, 'listingsAndReviews');

module.exports = mongoose.model('Airbnblistings', ListingSchema);
