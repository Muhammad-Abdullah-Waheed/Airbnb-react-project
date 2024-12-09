import React, { useState } from "react";
import axios from "axios";

const RegisterListing = () => {
  const [listingData, setListingData] = useState({
    Title: "",
    name: "",
    summary: "",
    space: "",
    description: "",
    neighborhood_overview: "",
    property_type: "",
    room_type: "",
    check_out_time:"",
    check_in_time:"",
    bed_type: "",
    minimum_nights: "",
    maximum_nights: "",
    cancellation_policy: "",
    accommodates: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    price: "",
    amenities: [],
    address: {
      street: "",
      suburb: "",
      government_area: "",
      market: "",
      country: "",
      country_code: "",
    },
    host: {
      host_name: "",
      host_location: "",
      host_about: "",
    },
    images: [],
  });

  const [addedPhotos,setAddedPhotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, key) => {
    const { name, value } = e.target;
    setListingData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setListingData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }));
  };

  const handleImageAdd = () => {
    setListingData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...listingData.images];
    newImages[index] = value;
    setListingData({ ...listingData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(listingData);
    axios
      .post("/api/admin/listings", listingData)
      .then((response) => {
        alert("Listing successfully added!");
        console.log(response.data);
      })
      .catch((error) => {
        alert("Error adding listing.");
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center py-3 rounded-2xl bg-theme">
        Register a New Listing
      </h1>
      <form onSubmit={handleSubmit} className="lg:px-24 md:px-10 sm:px-3">
        {/* Basic Information */}
        <div className="grid gap-2 lg:grid-cols-2 md:grid-cols-1 ">
          <div className="mb-3">
            <label className="block font-medium text-left">Title</label>
            <input
              type="text"
              name="Title"
              value={listingData.Title}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Title of your listing should be short and catchy as in advertisement"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">Property Name</label>
            <input
              type="text"
              name="name"
              value={listingData.name}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the name of the Place (Optinal)"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">
              Price per Night
            </label>
            <input
              type="text"
              name="price"
              value={listingData.price}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the Price Per Night"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">Bed Type</label>
            <input
              type="text"
              name="bed_type"
              value={listingData.bed_type}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the Price Per Night"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">Property Type</label>
            <input
              type="text"
              name="property_type"
              value={listingData.property_type}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the Price Per Night"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">Room Type</label>
            <input
              type="text"
              name="room_type"
              value={listingData.room_type}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the Price Per Night"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-left">Summary</label>
            <textarea
              name="summary"
              value={listingData.summary}
              onChange={handleChange}
              className="w-full border rounded p-3"
              placeholder="Enter a brief summary"
              rows="3"
            />
          </div>

          <div>
            <label className="block font-medium text-left">
              Neighborhood Overview
            </label>
            <textarea
              name="neighborhood_overview"
              value={listingData.neighborhood_overview}
              onChange={handleChange}
              className="w-full border rounded p-3"
              placeholder="Enter a brief summary"
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">
              Minimum Nights
            </label>
            <input
              type="text"
              name="minimum_nights"
              value={listingData.minimum_nights}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the minimum number of nights one can stay there."
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">
              Maximum Nights
            </label>
            <input
              type="text"
              name="maximum_nights"
              value={listingData.maximum_nights}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the Maximum number of nights one can stay there."
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">Bathrooms</label>
            <input
              type="text"
              name="bathrooms"
              value={listingData.bathrooms}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the number of bathrooms"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-left">BedRooms</label>
            <input
              type="text"
              name="bedrooms"
              value={listingData.bedrooms}
              onChange={handleChange}
              className="w-full border rounded-2xl p-3"
              placeholder="Enter the numbers of bedrooms"
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-3">
          <h2 className="text-2xl py-3 rounded-2xl mb-2 font-semibold bg-gray-300">
            Select Amenities
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 text-xl gap-4">
            {[
              "TV",
              "Wifi",
              "Kitchen",
              "Elevator",
              "Free street parking",
              "Washer",
              "Hangers",
              "Laptop friendly workspace",
              "translation missing: en.hosting_amenity_49",
              "translation missing: en.hosting_amenity_50",
              "Private entrance",
              "Hot water",
              "Microwave",
              "Coffee maker",
              "Refrigerator",
              "Dishwasher",
              "Dishes and silverware",
              "Cooking basics",
              "Oven",
              "Stove",
              "Patio or balcony",
              "Garden or backyard",
              "Long term stays allowed",
              "Wide hallway clearance",
              "Wide doorway",
              "Flat path to front door",
              "Well-lit path to entrance",
              "Disabled parking spot",
              "Wide doorway",
              "Wide clearance to bed",
              "Accessible-height bed",
              "Step-free access",
              "Wide doorway",
              "Accessible-height toilet",
              "Wide entryway",
              "Host greets you",
              "Handheld shower head",
            ].map((amenity, index) => (
              <div key={index} className="flex items-center">
                <input
                  name={amenity}
                  type="checkbox"
                  value={amenity}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div>
          <h2 className="text-2xl font-semibold rounded-lg py-3 my-4 bg-gray-300 ">Address</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block font-medium text-xl">Street</label>
              <input
                type="text"
                name="street"
                value={listingData.address.street}
                onChange={(e) => handleNestedChange(e, "address")}
                className="w-full border rounded p-3"
                placeholder="Enter street"
              />
            </div>
            <div>
              <label className="block font-medium">Suburb</label>
              <input
                type="text"
                name="suburb"
                value={listingData.address.suburb}
                onChange={(e) => handleNestedChange(e, "address")}
                className="w-full border rounded p-3"
                placeholder="Enter suburb"
              />
            </div>
            <div>
              <label className="block font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={listingData.address.country}
                onChange={(e) => handleNestedChange(e, "address")}
                className="w-full border rounded p-3"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Host Section */}
        <div>
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-300">Host Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Host Name</label>
              <input
                type="text"
                name="host_name"
                value={listingData.host.host_name}
                onChange={(e) => handleNestedChange(e, "host")}
                className="w-full border rounded p-3"
                placeholder="Enter host name"
              />
            </div>
            <div>
              <label className="block font-medium">Host Location</label>
              <input
                type="text"
                name="host_location"
                value={listingData.host.host_location}
                onChange={(e) => handleNestedChange(e, "host")}
                className="w-full border rounded p-3"
                placeholder="Enter host location"
              />
            </div>
          </div>
        </div>

        {/* Check in&out Section */}
        <div>
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-300">Check In & Out Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Check in time</label>
              <input
                type="text"
                name="check_in_time"
                value={listingData.check_in_time}
                onChange={(e) => handleNestedChange(e, "host")}
                className="w-full border rounded p-3"
                placeholder="Enter host name"
              />
            </div>
            <div>
              <label className="block font-medium">Check out time</label>
              <input
                type="text"
                name="check_out_time"
                value={listingData.check_out_time}
                onChange={(e) => handleNestedChange(e, "host")}
                className="w-full border rounded p-3"
                placeholder="Enter host location"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-300">Images</h2>
          <button
            type="button"
            onClick={handleImageAdd}
            className="bg-blue-500  text-white px-4 py-2 rounded-full"
          >
            Add Image URL
          </button>
          {listingData.images.map((image, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(e, index)}
                className="w-full border rounded p-3"
                placeholder="Enter image URL"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-theme rounded-full text-white px-6 py-3  font-bold mt-4"
          >
            Register Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterListing;
// D:\my_mv_\Ubuntu 64-bit.vmdk