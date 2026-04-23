import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../userContex";
import { BookingCard } from "./bookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [listingsById, setListingsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { User } = useContext(UserContext);

  useEffect(() => {
    let ignore = false;

    const fetchBookingsAndListings = async () => {
      if (!User) return;
      setLoading(true);
      setError("");

      try {
        const bookingsResponse =
          User.role !== "admin"
            ? await axios.get(`/api/bookings/user/${User._id}`)
            : await axios.get(`/api/allBookings`);

        const bookingsData =
          (User.role !== "admin"
            ? bookingsResponse.data.bookings
            : bookingsResponse.data) || [];

        if (ignore) return;
        setBookings(bookingsData);

        // De-duplicate listing IDs so we fetch each listing only once,
        // even if the user has multiple bookings for the same place.
        const listingIds = [
          ...new Set(bookingsData.map((b) => b.place).filter(Boolean)),
        ];

        // Resolve each listing independently so one missing/deleted
        // listing doesn't wipe out the whole page.
        const listingResults = await Promise.all(
          listingIds.map((id) =>
            axios
              .get(`/api/getlistings/${id}`)
              .then((r) => [id, r.data])
              .catch(() => [id, null])
          )
        );

        if (ignore) return;
        const byId = Object.fromEntries(listingResults);
        setListingsById(byId);
      } catch (err) {
        if (ignore) return;
        // 404 just means no bookings; treat as empty.
        if (err.response?.status === 404) {
          setBookings([]);
        } else {
          console.error("Error fetching bookings or listings:", err);
          setError("Couldn't load your bookings. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBookingsAndListings();

    return () => {
      ignore = true;
    };
  }, [User]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-4">
        <div className="font-semibold text-2xl p-4 text-left">My Bookings</div>
        <div className="p-6 text-gray-600">
          You don't have any bookings yet. Find a place you love and reserve it.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="font-semibold text-2xl p-4 text-left">My Bookings</div>

      <div className="flex flex-wrap gap-4 px-4">
        {bookings.map((booking) => {
          const listing = listingsById[booking.place];
          // If the underlying listing was deleted, still render a card with
          // whatever booking info we have instead of hiding it entirely.
          return (
            <BookingCard
              key={booking._id}
              listing={listing}
              bookingInfo={booking}
              admin={User?.role === "admin"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
