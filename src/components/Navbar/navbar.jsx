import React, { useState, useEffect, useRef } from "react";
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
import { useNavigate } from "react-router-dom";

const Navbar = ({ showNavMid2 = true }) => {
  const [location, setloation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Toggle `isScrolled` state based on scroll position
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLocationInput = (event) => {
    setloation(event.target.value);
  };

  return (
    <div className="navbar-container fixed top-0 left-0 w-full bg-white z-40">
      <div>
        <div>
          {" "}
          <MobileSearchBar />
        </div>
        <nav className={`Navbar h-20 flex justify-between items-center px-12 sticky z-10 bg-white  ${isScrolled? "border-b-2":""}`}>
          <img
            src={logo}
            alt="website logo"
            className="navbar-logo h-8 cursor-pointer contrast-200"
          />

          {!isScrolled ? (
            <div className="nav-mid-1 pl-[2vw] pr-[2vw] ml-[10vw] transition-opacity duration-300">
              <button className="rounded-[20px] m-4 text-font-grey text-lg">
                Stays
              </button>
              <button className="rounded-[20px] m-4 text-font-grey text-lg">
                Experiences
              </button>
            </div>
          ) : (
            <div
              className={`mid-navbar-3 cursor-pointer flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300 hover:scale-105 transition duration-150 ease-in-out  ${
                !isScrolled ? "animate-scaleIn" : "animate-scaleUp"
              }`}
            >
              <div>Anywhere</div>
              <div className="border-l border-gray-300"></div>
              <div>Any week</div>
              <div className="border-l border-gray-300"></div>
              <div>Add guests</div>
              <button className="bg-primary text-white p-1 rounded-full">
                <SearchRoundedIcon
                  style={{
                    backgroundColor: "var(--theme)",
                    marginLeft: "4px",
                    borderRadius: "20px",
                    height: "1.5rem",
                    width: "1.5rem",
                    transform: "translateY(-5px)",
                  }}
                />
              </button>
            </div>
          )}

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

      <div
        className={`sticky bg-white shadow-sm transition-all duration-300 ease-in-out  ${
          isScrolled ? "pb-0 hidden" : "pb-2"
        }`}
      >
        {/* Main Navigation Component */}
        <div
          className={`nav-mid2 flex justify-center gap-2 bg-white transition-transform duration-300 ease-in-out ${
            isScrolled
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <ul className="flex items-center space-x-[1%] py-1 px-2 w-[65%] bg-white rounded-full shadow-md text-sm border-[1px] cursor-pointer">
            {/* Where Section - First Item (1/3 width) */}
            <li className="inline-flex items-center pr-3 w-1/3 border-gray-300 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
              <span className="text-gray-500 font-medium">Where</span>
              <input
                type="text"
                placeholder="Search destination"
                className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
              />
            </li>

            {/* Spacer */}
            <li className="border-r-[1px] border-gray-300 h-11"></li>

            {/* Date Section with StartDatePicker (1/6 width) */}
            <li className="inline-flex items-center pr-3 w-1/6 border-gray-300 pl-4 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
              <span className="text-gray-500 font-medium">Date</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select dates"
                className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
              />
            </li>

            {/* Spacer */}
            <li className="border-r-[1px] border-gray-400 h-14"></li>

            {/* Date Section with endDatePicker (1/6 width) */}
            <li className="inline-flex items-center pr-3 w-1/6 border-gray-300 pl-4 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3">
              <span className="text-gray-500 font-medium">Date</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setendDate(date)}
                placeholderText="Select dates"
                className="ml-2 w-full p-2 border-transparent focus:ring-0 outline-none rounded-full text-gray-700 placeholder-gray-400 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out"
              />
            </li>

            {/* Spacer */}
            <li className="border-r-[1px] border-gray-400 h-14"></li>

            {/* Who Section - Last Item (1/3 width) */}
            <li className="inline-flex items-center pl-2 pr-2 w-1/3 hover:bg-gray-100 hover:scale-105 transition duration-150 ease-in-out rounded-full px-2 py-3 ">
              <GuestCountSelector />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click target is outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    setIsOpen(false); // Close the dropdown
    navigate("/login"); // Navigate to the login page
  };

  const handleSignUpClick = () => {
    setIsOpen(false); // Close the dropdown
    navigate("/register"); // Navigate to the SignUp page
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={menuRef}
        onClick={toggleDropdown}
        className="bg-white hover:shadow-md px-3 py-1 rounded-full border-[1px] "
      >
        <MenuIcon sx={{ fontSize: "2rem", color: "black", padding: " 7px" }} />
        <AccountCircleIcon sx={{ fontSize: "2.4rem", color: "gray" }} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="fixed right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50"
          ref={menuRef}
        >
          <div>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLoginClick}
            >
              Log in
            </button>
            <hr />
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Gift cards
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Airbnb your home
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Host an experience
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Help center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Generic Counter Component
const Counter = ({ label, description, count, onIncrement, onDecrement, minCount = 0 }) => (
  <div className="guest-category flex justify-between items-center py-4 border-b border-gray-200">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <div className="counter flex items-center space-x-4">
      <button
        className="counter-button w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold transition hover:bg-gray-300 disabled:opacity-50"
        onClick={onDecrement}
        disabled={count === minCount}
        aria-label={`Decrease ${label.toLowerCase()} count`}
      >
        -
      </button>
      <span className="counter-value text-lg font-medium text-gray-700">{count}</span>
      <button
        className="counter-button w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold transition hover:bg-blue-600"
        onClick={onIncrement}
        aria-label={`Increase ${label.toLowerCase()} count`}
      >
        +
      </button>
    </div>
  </div>
);

const GuestCountSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="">
      <button
        className="flex justify-center items-center"
        onClick={toggleOpen}
      >
        <span className="text-gray-500 font-medium">Who</span>
        <div className="text-gray-400 font-small px-8">Add Guest</div>
        <SearchRoundedIcon
          style={{
            fontSize: "1px",
            backgroundColor: "var(--theme)",
            marginLeft: "10px",
            borderRadius: "20px",
            height: "2.5rem",
            width: "2.5rem",
          }}
        />
      </button>

      {isOpen && (
        <div className="guest-selector fixed top-0 mt-20 w-[30vw] p-6 bg-white rounded-lg shadow-lg border-black max-w-md mx-auto">
          <Counter
            label="Adults"
            description="Ages 13 or above"
            count={adults}
            onIncrement={() => setAdults(adults + 1)}
            onDecrement={() => setAdults(adults - 1)}
          />
          <Counter
            label="Children"
            description="Ages 2–12"
            count={children}
            onIncrement={() => setChildren(children + 1)}
            onDecrement={() => setChildren(children - 1)}
          />
          <Counter
            label="Pets"
            description="Up to 2 pets allowed"
            count={pets}
            onIncrement={() => setPets(pets + 1)}
            onDecrement={() => setPets(pets - 1)}
          />
        </div>
      )}
    </div>
  );
};