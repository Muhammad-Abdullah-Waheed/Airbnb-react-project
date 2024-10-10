import React from "react";
import "./navbar.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"; // Importing search icon from react-icons

const MobileSearchBar = () => {
  return (
    <div className="mobile-search-bar">
      <SearchRoundedIcon className="searchbar-icon" />
      <div><input
        type="text"
        className="search-input"
        placeholder="Search destination"
      />
        {/* <div className="search-options">
          <span>Any week</span>
          <span>Add guests</span>
        </div> */}
      </div>
    </div>
  );
}

export default MobileSearchBar;
