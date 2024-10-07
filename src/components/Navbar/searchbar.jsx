import React from "react";
import "./navbar.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"; // Importing search icon from react-icons

const MobileSearchBar = () => {
  return (
      <div className="mobile-search-bar">
        <SearchRoundedIcon/>
      <FaSearch className="search-icon" />
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search..." 
      />
      <div className="search-options">
        <span>Any week</span>
        <span>Add guests</span>
      </div>
    </div>
  );
}

export default MobileSearchBar;
