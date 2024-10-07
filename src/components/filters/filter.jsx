import React, { useState } from "react";
import { links } from "../filters/filterlinks";
import "../filters/style.css";

function Filter() {
    const [selectedFilter, setSelectedFilter] = useState("");

  // Function to handle filter selection
  return (
    <div className="filters-containers">
      {links.map((item, i) => (
        <div
          key={i}
          className={`links-box ${i == selectedFilter && "selected-box"}`}
          onClick={() => {
            console.log(`links-box ${i == selectedFilter && "selected-box"}`);
            setSelectedFilter(i);
          }}>
          <img src={item.imgSrc} className="links-img" />
          <p
            className={`links-label ${i == selectedFilter && "selected-label"}`}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Filter;