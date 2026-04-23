import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ card, showButtons }) => {
  const navigate = useNavigate();

  const deleteListing = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    // No Authorization header needed — the browser automatically sends the
    // httpOnly JWT cookie because axios.defaults.withCredentials is true.
    // The server verifies ownership using the decoded token.
    try {
      const response = await axios.delete(`/api/listings/delete/${card._id}`);
      console.log("Response:", response.data);
      alert("Listing deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting listing:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to delete listing.");
    }
  };

  const editListig = (ev) => {
    ev.preventDefault();
    navigate(`/Account/listings/update/${card._id}`);
  };

  const seeListing = (ev) => {
    ev.preventDefault();
    navigate(`/listing/${card._id}`);
  };

  return (
    <button onClick={seeListing}>
      <div className="card-container relative">
      {/* Conditional Buttons */}
      {showButtons && (
        <>
          <button
            className="absolute top-2 left-2 bg-theme text-white p-2 rounded-full hover:bg-gray-600"
            onClick={editListig}
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
          <button
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600  hover:text-black"
            onClick={deleteListing}
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="card-image-container">
        {card.images.map((src, i) =>
          src ? (
            <img
              key={i}
              src={src}
              className="card-image object-cover "
              alt={`slide ${i}`}
            />
          ) : null
        )}
      </div>

      {/* Card Details */}
      <div className="card-details">
        <h5 className="font-medium">
          {card.address.suburb}, {card.address.country}
        </h5>
        <h5 className="font-normal text-[#6a6a6a]">{card.Title}</h5>

        <p className="font-semibold">
          ${card.price} <span className="font-normal">night</span>
        </p>
        {card.isSold && <h4 className="card-status">Sold</h4>}
      </div>
    </div>
    </button>
  );
};

export default Card;
