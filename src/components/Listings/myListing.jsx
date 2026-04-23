import React, { useContext, useEffect, useState } from "react";
import RegisterListing from "./RigisterListing";
import axios from "axios";
import { UserContext } from "../../userContex";
import Cards from "../Card/Cards";

const MyListing = () => {
  const [addListing, setAddListing] = useState(false);
  const { User, SetUser } = useContext(UserContext);
  const handleAddListing = (ev) => {
    ev.preventDefault();
    setAddListing(true);
  };

  return (
    <div>
      {!addListing && (
        <div className="mt-6 flex content-center justify-center">
          <button
            className="bg-theme flex rounded-full p-2 px-4 gap-2 shadow-lg text-white"
            onClick={handleAddListing}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Add new Listing
          </button>
        </div>
      )}

      {addListing && (
        <div>
          <RegisterListing />
        </div>
      )}

      {!addListing && (
        <div>
          <UserListing userEmail={User.email} />
        </div>
      )}
    </div>
  );
};

export default MyListing;

const UserListing = ({ userEmail }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings when the component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Send GET request to API endpoint to fetch user listings
        const response = await axios.get(`/api/listings/${userEmail}`);
        setListings(response.data.listings); // Store listings in state
        console.log(listings);
      } catch (err) {
        setError("Failed to fetch listings");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchListings(); // Call the fetch function
  }, [userEmail]); // Re-fetch if userEmail changes

  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>{error}</div>; // Display error message if there's an issue

  return (
    <div>
      <Cards list={listings} showbuttons={true} />
    </div>
  );
};
