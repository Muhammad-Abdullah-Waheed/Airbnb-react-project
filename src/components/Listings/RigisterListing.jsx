import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { UserContext } from "../../userContex";
import { useNavigate, useParams } from "react-router-dom";

const RegisterListing = ({ newListing = true }) => {
  const { User, SetUser } = useContext(UserContext);
  const { id } = useParams();
  const [Id, SetId] = useState(id);
  const [ready, SetReady] = useState(false);

  const navigate = useNavigate();

  const [listingData, setListingData] = useState({
    UserEmail: newListing ? User.email : "",
    Title: "",
    name: "",
    summary: "",
    space: "",
    description: "",
    neighborhood_overview: "",
    property_type: "",
    room_type: "",
    check_out_time: "",
    check_in_time: "",
    bed_type: "",
    minimum_nights: "",
    maximum_nights: "",
    cancellation_policy: "",
    accommodates: 5,
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

  useEffect(() => {
    if (Id) {
      axios
        .get(`/api/getlistings/${Id}`)
        .then((response) => {
          setListingData(response.data);
          SetReady(true);
          setSelectedAmenities(response.data.amenities);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [Id]);

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [addedPhotos, setAddedPhotos] = useState([]);

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
    console.log(listingData);
    listingData.amenities = selectedAmenities;
    if(!Id)
    {
      axios
      .post("/api/listings", listingData)
      .then((response) => {
        alert("Listing successfully added!");
        console.log(response.data);
      })
      .catch((error) => {
        alert("Error adding listing."); 
        console.error(error);
      });
    }
    else
    {
      axios
      .put("/api/listings/update/" + Id, listingData)
      .then((response) => {
        alert("Listing successfully Updated!");
        console.log(response.data);
      })
      .catch((error) => {
        alert("Error Updating listing.");
        console.error(error);
      });
    }
    navigate('/Account/listings');
  };

  const Amenities = [
    "TV",
    "Wifi",
    "Free street parking",
    "Laptop workspace",
    "Private entrance",
    "Hot water",
    "Oven",
    "Sun light",
  ];

  // Icon mapping for each amenity
  const amenityIcons = {
    TV: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    "Laptop workspace": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    Wifi: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
        />
      </svg>
    ),
    "Free street parking": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    Oven: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
      </svg>
    ),
    "Private entrance": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
        />
      </svg>
    ),
    "Hot water": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
    "Sun light": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
      </svg>
    ),
    // Add more amenities and their respective icons here...
  };

  

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(
      (prev) =>
        prev.includes(amenity)
          ? prev.filter((item) => item !== amenity) // Remove if already selected
          : [...prev, amenity] // Add if not selected
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-9 text-center py-1 pb-3 rounded-2xl bg-gray-100">
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
          <h2 className="text-2xl py-3 rounded-2xl mb-2 font-semibold bg-gray-100">
            Select Amenities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
            {Amenities.map((amenity, index) => (
              <div
                key={index}
                className={`w-52 flex items-center p-4 gap-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAmenities.includes(amenity)
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
                onClick={() => toggleAmenity(amenity)}
              >
                {amenityIcons[amenity] || (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                )}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address Section */}
        <div>
          <h2 className="text-2xl font-semibold rounded-lg py-3 my-4 bg-gray-100 ">
            Address
          </h2>
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
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-100">
            Host Information
          </h2>
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
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-100">
            Check In & Out Information
          </h2>
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

        {/* pics:[
            "https://a0.muscache.com/im/pictures/miso/Hosting-832355501498041527/original/551de2c9-6981-4222-b21d-75dd8792bd2d.jpeg?im_w=1440&im_q=highq",
            "https://a0.muscache.com/im/pictures/miso/Hosting-832355501498041527/original/ca8c5bfa-9fa6-47b8-81c9-4af891d721a4.jpeg?im_w=1440&im_q=highq",
            "https://a0.muscache.com/im/pictures/miso/Hosting-833065158983976179/original/aa9500e6-5f12-443e-ae0f-a6c7aed8525e.jpeg?im_w=1440&im_q=highq",
            "https://a0.muscache.com/im/pictures/miso/Hosting-833065158983976179/original/6e9c1a61-294c-483a-a4c5-5c0c389df56a.jpeg?im_w=1440&im_q=highq",
            "https://a0.muscache.com/im/pictures/miso/Hosting-833065158983976179/original/2f21d8ec-0479-46cb-9d4a-04f60f28127e.jpeg?im_w=1440&im_q=highq",
            "https://a0.muscache.com/im/pictures/miso/Hosting-833065158983976179/original/6796f494-b69a-41d5-bc48-0cfe2ae9ee72.jpeg?im_w=1440&im_q=highq"
            ] */}

        {/* Image Upload Section */}
        <div>
          <h2 className="text-xl font-semibold py-3 my-4 bg-gray-100">
            Add Images Here
          </h2>

          <div className="flex gap-3 flex-wrap pb-3">
            {listingData.images.map(
              (image, index) =>
                image && (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg shadow-md"
                  >
                    <img
                      src={image} // Use `image` from the array
                      alt={`Gallery image ${index + 1}`}
                      className="w-40 h-40 object-cover"
                    />
                  </div>
                )
            )}
          </div>

          <button
            type="button"
            onClick={handleImageAdd}
            className="bg-blue-500  text-white px-4 py-2 rounded-full flex gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </button>

          <div className="overflow-y-scroll h-14 border rounded mt-2">
            {listingData.images.map((image, index) => (
              <div key={index} className="mt-1">
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
