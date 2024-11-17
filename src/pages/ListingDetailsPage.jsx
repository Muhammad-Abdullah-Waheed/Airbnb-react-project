import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import axios from "axios";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    axios
      .get(`/api/listings/${id}`)
      .then((response) => {
        setListing(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching listing:", err);
        setError("Listing not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !listing) {
    return <div>{error || "An unexpected error occurred."}</div>;
  }

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="Listing-Detail relative top-44 mt-0 bg-gray-100 mx-8 px-8 py-8 rounded-lg shadow-md">
        {/* Title and Address */}
        <div className="mb-4">
          <div className="flex">
            <h1 className="text-3xl font-medium text-left">{listing.name}</h1>
          </div>
          <a
            href={`https://maps.google.com/?q=${listing.address.street}`}
            target="_blank"
            rel="noopener noreferrer"
            className="my-2 block font-semibold underline text-left"
          >
            {listing.address.street}
          </a>
        </div>

        <div className="grid  gap-2 grid-cols-[2fr_1fr]">
          <div>
            <img
              src="https://a0.muscache.com/im/pictures/f84733a5-146f-4db3-a366-2386fb4847de.jpg?im_w=960"
              alt={listing.name}
              className="w-full h-72 object-cover rounded-md mb-4"
            />
          </div>

          <div>
            <img
              src="https://a0.muscache.com/im/pictures/miso/Hosting-18801165/original/d2e575d2-e68c-4c47-a428-e843b9f3cc6d.jpeg?im_w=720"
              alt="hhhhhhhhh"
            />
            <img
              src="https://a0.muscache.com/im/pictures/miso/Hosting-18801165/original/41a6efaa-71f6-484e-83eb-ed42cd012f12.jpeg?im_w=720"
              alt="jjjjjjjjj"
            />
          </div>
          
        </div>

        {/* Image */}
        {listing["host"].host_thumbnail_url && (
          <img
            src={listing.images.picture_url}
            alt={listing.name}
            className="w-full h-72 object-cover rounded-md mb-4"
          />
        )}

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">About the Listing</h2>
          <p className="text-gray-700 mt-2">{listing.description}</p>
        </div>

        {/* Host Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Meet the Host</h2>
          <div className="flex items-center mt-2">
            <img
              src={listing.host.host_thumbnail_url}
              alt={listing.host.host_name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <p className="font-bold">{listing.host.host_name}</p>
              <p className="text-gray-600">
                Response rate: {listing.host.host_response_rate}%
              </p>
              <p className="text-gray-600">
                {listing.host.host_is_superhost && "Superhost"}
              </p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Amenities</h2>
          <ul className="grid grid-cols-2 gap-2 mt-2 text-gray-700">
            {listing.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {amenity}
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        {listing.reviews?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <div className="mt-2">
              {listing.reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-300 py-4">
                  <p className="text-gray-800">
                    <span className="font-bold">{review.reviewer_name}</span>:{" "}
                    {review.comments}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Reviewed on {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price and Booking Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Booking Details</h2>
          <p className="text-gray-700 mt-2">
            <span className="font-bold">Price: </span>${listing.price}/night
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Minimum Nights: </span>
            {listing.minimum_nights}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Maximum Nights: </span>
            {listing.maximum_nights}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
