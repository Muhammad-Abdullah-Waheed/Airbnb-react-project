import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../userContex";
import { useNavigate } from "react-router-dom";
import { BookingCard } from "./bookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);

  const { User, SetUser } = useContext(UserContext);

  useEffect(() => {
    const fetchBookingsAndListings = async () => {
      try {
        // Step 1: Fetch bookings by userId
        var bookingsResponse =
          User.role != "admin"
            ? await axios.get(`/api/bookings/user/${User._id}`)
            : await axios.get(`/api/allBookings`);
        // if(User.role !== 'admin') {
        //   bookingsResponse = await axios.get(
        //     `/api/bookings/user/${User._id}`
        //   );
        // }
        // else{
        //   bookingsResponse = await axios.get(
        //     `/api/allBookings`
        //   );
        // }
        const bookingsData = (User.role != "admin"
            ? bookingsResponse.data.bookings
            : bookingsResponse.data) || [];
        // const bookingsData = bookingsResponse.data.bookings || [];
        setBookings(bookingsData);

        // Step 2: Extract listing IDs from bookings
        const listingIds = [
          ...new Set(bookingsData.map((booking) => booking.place)),
        ];

        // Step 3: Fetch each listing by its ID
        const listingPromises = listingIds.map((id) =>
          axios.get(`/api/getlistings/${id}`).then((response) => response.data)
        );

        // Step 4: Resolve all promises and set listings
        const fetchedListings = await Promise.all(listingPromises);
        console.log("fecthed", fetchedListings);
        setListings(fetchedListings);
      } catch (error) {
        console.error("Error fetching bookings or listings:", error);
      }
    };

    fetchBookingsAndListings();
  }, []); // Dependency array to re-run when userId changes

  if (listings.length <= 0) {
    return <div>loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="font-semibold text-2xl p-4 text-left">My Bookings</div>

      <div className="flex">
        {listings.map((listing, index) => (
          <BookingCard
            key={index}
            listing={listing}
            bookingInfo={bookings[index]}
            admin = {(User.role == "admin")? true:false}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
