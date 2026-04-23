import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays } from "date-fns";
import { UserContext } from "../userContex";

const ListingDetailsPage = () => {
  const Amenities = [
    "TV",
    "Wifi",
    "Free street parking",
    "Laptop workspace",
    "Private entrance",
    "Hot water",
    "Oven",
    "Sun light",
  ];

  // Icon mapping for each amenity
  const amenityIcons = {
    TV: (
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
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    "Laptop workspace": (
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
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    Wifi: (
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
          d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
        />
      </svg>
    ),
    "Free street parking": (
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
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
    Oven: (
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
          d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
      </svg>
    ),
    "Private entrance": (
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
          d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
        />
      </svg>
    ),
    "Hot water": (
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
          d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
    "Sun light": (
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
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
      </svg>
    ),
    // Add more amenities and their respective icons here...
  };

  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhotos, setShowPhotos] = useState(false);
  const [error, setError] = useState(null);

  const { User, SetUser } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  var totaldays = 5;
  if (checkInDate && checkOutDate) {
    totaldays = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );
  }

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    axios
      .get(`/api/getlistings/${id}`)
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

  // Only send data the server needs. `guestId` comes from the JWT on the
  // server, and `price` is computed server-side from the listing + dates so
  // the client cannot tamper with it.
  const saveBookingandler = async (ev) => {
    ev.preventDefault();

    if (!User) {
      alert("Please log in to book a place.");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }

    const data = {
      listingId: listing._id,
      checkInDate,
      checkOutDate,
      guestName: User.name,
      phone: phoneNumber,
      guestCount: Math.max(1, adults + children),
    };

    try {
      const response = await axios.post("/api/savebooking", data);
      alert(
        response.data.message ||
          "Booking created. Go to 'My Bookings' and complete payment within 15 minutes to lock in your dates."
      );
    } catch (err) {
      // Distinguish "already booked" (409) from other server errors based
      // on HTTP status rather than fragile message matching.
      if (err.response?.status === 409) {
        alert("This place is already booked for the selected dates.");
      } else if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
      } else {
        alert(err.response?.data?.error || "Could not complete booking.");
        console.error("Booking error:", err);
      }
    }
  };

  if (showPhotos && !loading) {
    return (
      <div className="bg-black h-full w-full p-6">
        <div className="relative">
          {listing.images.length > 0 &&
            listing.images.map((image) => (
              <div>
                <img
                  src={image}
                  alt="listing photo"
                  className="p-2 object-cover h-full w-full"
                />
              </div>
            ))}
        </div>

        <button
          className="fixed top-10 bg-white rounded-full flex p-2 font-bold right-12"
          onClick={() => setShowPhotos(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 text-black "
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span>Close photos</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Navbar showNavMid2={false} />
      <div className="Listing-Detail mt-[6%] bg-gray-100 mx-8 px-8 py-8 rounded-lg shadow-md">
        {/* Title and Address */}
        <div className="mb-4">
          <div className="flex">
            <h1 className="text-3xl font-medium text-left">{listing.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="true"
                viewBox="0 0 24 24"
                stroke-width="1.3"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              <p>
                4.96 . <span>270 reviews </span>
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${listing.address.street}`}
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 block font-semibold underline text-left"
            >
              {listing.address.street} , {listing.address.suburb}{" "}
              {listing.address.country}
            </a>
          </div>
        </div>

        <div className=" relative ">
          <div className="grid gap-2 lg:grid-cols-[2fr_1fr_1fr] md:grid-col-[2fr_1fr_1fr]">
            <div className="">
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full object-cover rounded-md h-80"
              />
            </div>

            <div className="flex flex-col gap-2">
              <img
                src={listing.images[1]}
                alt="hhhhhhhhh"
                className="object-cover h-[9.7rem] rounded-md"
              />
              <img
                src={listing.images[3]}
                alt="jjjjjjjjj"
                className="object-cover h-[9.7rem] rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <img
                src={listing.images[4]}
                alt="jjjjjjjjj"
                className="object-cover h-[9.7rem] rounded-md"
              />

              <img
                src={listing.images[5]}
                alt="hhhhhhhhh"
                className="object-cover h-[9.7rem] rounded-md"
              />
            </div>
          </div>

          <button
            className="bg-gray-300 rounded-md shadow-md flex absolute bottom-4 p-2 right-2 gap-1"
            onClick={() => setShowPhotos(true)}
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
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
            Show more photos
          </button>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-4">
          <div>
            {/* Description */}
            <div className="mb-6 text-left py-4">
              <h2 className="text-2xl font-bold">
                {listing.property_type} {listing.room_type},{" "}
                {listing.address.country}
              </h2>
              <p className="text-[#222222] font-normal mt-1">
                {listing.bedrooms} bedrooms
                <span class="pen26si dir dir-ltr">
                  <span
                    class="s1b4clln atm_mj_glywfm atm_vb_glywfm atm_vv_1jtmq4 atm_lk_idpfg4 atm_ll_idpfg4 dir dir-ltr"
                    aria-hidden="true"
                  >
                    {" "}
                    ·{" "}
                  </span>
                </span>
                {listing.bathrooms} bathrooms
                <span class="pen26si dir dir-ltr">
                  <span
                    class="s1b4clln atm_mj_glywfm atm_vb_glywfm atm_vv_1jtmq4 atm_lk_idpfg4 atm_ll_idpfg4 dir dir-ltr"
                    aria-hidden="true"
                  >
                    {" "}
                    ·{" "}
                  </span>
                </span>
                {listing.accommodates} accommodates
              </p>

              <div className="w-full ">
                <h2 className="text-xl pt-2 font-bold"> Discription</h2>
                <p>{listing.summary}</p>
              </div>
            </div>

            {/* Host Information */}
            <div className="mb-6 border-t-2 w-full text-left">
              <h2 className="text-2xl font-semibold">
                Hosted by {listing.host.host_name}
              </h2>
              <div className="flex items-center mt-2">
                <img
                  src="https://a0.muscache.com/im/pictures/user/26c5d96a-cd24-4342-bd60-dc76435f7a88.jpg?im_w=240&im_format=avif"
                  alt={listing.host.host_name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                {listing.host.host_location}
                <div></div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6 border-t-2  w-full">
              <h2 className="text-2xl font-semibold text-left">
                What this place offers
              </h2>
              <ul className="grid md:grid-cols-2 sm:grid-col-1 gap-2 mt-2 text-gray-700 justify-center">
                {listing.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    {amenityIcons[amenity]}
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Booking Info */}
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-semibold ">Booking Details</h2>
              <p className="text-[#222222] mt-2t">
                <span className="font-bold">Price: </span>${listing.price}/night
              </p>
              <div className="flex gap-4">
                <p className="text-[#222222]">
                  <span className="font-bold">Minimum Nights: </span>
                  {listing.minimum_nights}
                </p>

                <span class="pen26si dir dir-ltr">
                  <span
                    class="s1b4clln atm_mj_glywfm atm_vb_glywfm atm_vv_1jtmq4 atm_lk_idpfg4 atm_ll_idpfg4 dir dir-ltr"
                    aria-hidden="true"
                  >
                    {" "}
                    ·{" "}
                  </span>
                </span>

                <p className="text-[#222222]">
                  <span className="font-bold">Maximum Nights: </span>
                  {listing.maximum_nights}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 h-6/7  w-full flex justify-center">
            <div className="bg-white w-2/3 rounded-xl p-6">
              <div className="text-2xl text-center font-semibold py-2">
                ${listing.price} per night
              </div>
              <div className="flex justify-center text-left text-sm font-semibold">
                <div className="border-[1px] border-black rounded-tl-lg px-5 py-1">
                  <label htmlFor="">CHECK-IN:</label>
                  <br />
                  <input
                    type="date"
                    placeholder={checkInDate}
                    onChange={(ev) => setCheckInDate(ev.target.value)}
                  />
                </div>
                <div className="border-[1px] border-black rounded-tr-lg px-4 py-1">
                  <label htmlFor="">CHECK-OUT:</label>
                  <br />
                  <input
                    type="date"
                    placeholder={checkOutDate}
                    onChange={(ev) => setCheckOutDate(ev.target.value)}
                  />
                </div>
              </div>
              <div className="text-left text-sm font-semibolds  border-[1px] border-black rounded-bl-lg rounded-br-lg  px-5 mb-2 py-1">
                <label className="font-semibold">GUESTS</label> <br />
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setIsOpen(!isOpen);
                  }}
                  className="border-gray-400 border-[1px] w-full text-left p-1 rounded-lg "
                >
                  {adults + children > 0 ? adults + children : 1} guests{" "}
                </button>
                {isOpen && (
                  <div className="absolute w-[30vw] p-6 bg-white rounded-lg shadow-lg border-black max-w-md mx-auto">
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

              <div className="border-[1px] border-black rounded-lg px-4 py-1 mb-2 text-left text-sm">
                  <label htmlFor="">PHONE NUMBER:</label>
                  <br />
                  <input
                    className="w-full p-1 m-1"
                    type="phone no"
                    placeholder={phoneNumber}
                    onChange={(ev) => setPhoneNumber(ev.target.value)}
                  />
                </div>

              <button className="bg-theme py-2 font-bold text-white w-full rounded-md" onClick={saveBookingandler}>
                Reserve
              </button>

              <div className="flex justify-between pt-2">
                <div className="underline">
                  ${listing.price} X {totaldays} nights
                </div>
                <div className="">${listing.price * totaldays} </div>
              </div>
              <div className="flex justify-between pt-2">
                <div className="underline">Airbnb Service Fee</div>
                <div className="">${(listing.price * totaldays * 0.2).toFixed(2)} </div>
              </div>
              <div className="flex justify-between pt-2 border-t-[2px]">
                <div className="font-semibold text-lg">Total before taxes</div>
                <div className="">
                  ${(listing.price * totaldays * 1.2).toFixed(2)}{" "}
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;

const Counter = ({
  label,
  description,
  count,
  onIncrement,
  onDecrement,
  minCount = 0,
}) => (
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
      <span className="counter-value text-lg font-medium text-gray-700">
        {count}
      </span>
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
