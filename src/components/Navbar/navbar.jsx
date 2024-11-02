import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LanguageIcon from "@mui/icons-material/Language";
import BottomNavBar from "../Navbar/bottomnavbar.jsx";
import MobileSearchBar from "../Navbar/searchbar";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Navbar = () => {
  const [location, setloation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const handleLocationInput = (event) => {
    setloation(event.target.value);
  };

  return (
    <div>
      <div>
        <div>
          {" "}
          <MobileSearchBar />
        </div>
        <nav className="Navbar h-20 flex justify-between items-center px-12 sticky z-50 bg-white ">
          <img
            src={logo}
            alt="website logo"
            className="navbar-logo h-8 cursor-pointer contrast-200"
          />

          <div className="nav-mid-1   pl-[2vw] pr-[2vw] ml-[10vw]">
            <button className="rounded-[20px] m-4 text-font-grey text-lg">
              Stays
            </button>
            <button className="rounded-[20px] m-4 text-font-grey text-lg">
              Experiences
            </button>
          </div>

          <div className="nav-right  flex justify-center items-center gap-1 p-0 bg-transparent">
            <div
              className="nav-right-home  px-4 py-2.5 font-semibold rounded-full
               hover:bg-grey cursor-pointer"
            >
              Airbnb your home
            </div>
            <div className="nav-right-lang nav-right-lang py-2 px-2.5 mt-1 rounded-full hover:bg-gray-300 cursor-pointer">
              {" "}
              <LanguageIcon sx={{ fontSize: "1.4rem" }} />
            </div>
            <DropdownMenu />
          </div>
        </nav>

        <div>
          <BottomNavBar />
        </div>
      </div>



      <div className="nav-mid2 flex justify-center py-4 bg-white">
        <ul className="flex items-center space-x-4 py-1 px-8 bg-white rounded-full shadow-md text-sm border-[1px] cursor-pointer">
          {/* Where Section */}
          <li className="inline-flex items-center pr-8 border-r border-gray-300 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
            <span className="text-gray-500 font-medium">Where</span>
            <input
              type="text"
              placeholder="Search destination"
              className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400  hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
            />
          </li>

          {/* Date Section with DatePicker */}
          <li className="inline-flex items-center pr-8 border-r border-gray-300 pl-4 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
            <span className="text-gray-500 font-medium">Date</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select dates"
              className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400  hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
            />
          </li>

          {/* Who Section */}
          <li className="inline-flex items-center pl-4 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
            <span className="text-gray-500 font-medium">Who</span>
            <input
              type="text"
              placeholder="Add guests"
              className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400  hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
            />
            <SearchRoundedIcon
              style={{
                fontSize: "1px",
                backgroundColor: "var(--theme)",
                padding: "0px",
                borderRadius: "20px",
                height: "2.5rem",
                width: "2.5rem",
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;












const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-white hover:shadow-md px-3 py-1 rounded-full border-[1px] "
      >
        <MenuIcon sx={{ fontSize: "2rem", color: "black", padding: " 7px" }} />
        <AccountCircleIcon sx={{ fontSize: "2.4rem", color: "gray" }} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Sign Up
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Log in
            </li>
            <hr />

            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Gift cards
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Airbnb your home
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Host an experience
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Help center
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};