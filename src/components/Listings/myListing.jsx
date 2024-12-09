import React, { useState } from "react";
import RegisterListing from "./RigisterListing";

const MyListing = () => {
  const [addListing, setAddListing] = useState(false);
  const handleAddListing = (ev) => {
    ev.preventDefault();
    setAddListing(true);
  };

  return (
    <div >
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
          <UserListing />
        </div>
      )}
    </div>
  );
};

export default MyListing;


const UserListing = () => {
  return (
    <div>UserListing</div>
  )
}

