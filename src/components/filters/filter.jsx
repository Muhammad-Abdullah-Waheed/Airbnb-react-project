import React, { useState, useEffect } from "react";
import { links } from "../filters/filterlinks";
import "../filters/style.css";

function Filter() {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    
  // Update `isScrolled` state on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Set true if scrolled down
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Function to handle filter selection
  return (
    <div className={`filter sticky z-20  shadow-md  bg-white ${
      isScrolled ? "top-[70px]" : "top-[160px]"} transition-all duration-100 ease-in-out`}>
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
    </div>
  );
}

export default Filter;