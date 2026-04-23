import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Small colored pill that communicates where this booking is in its
// lifecycle. Helps guests (and hosts) understand at a glance whether the
// dates are truly blocked or still waiting on payment.
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-gray-200 text-gray-700 border-gray-300",
  expired: "bg-red-100 text-red-800 border-red-300",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${
      statusStyles[status] || statusStyles.pending
    }`}
  >
    {status?.toUpperCase()}
  </span>
);

// Live countdown timer for pending bookings. Ticks every second and returns
// mm:ss until the hold expires.
const useCountdown = (expiresAt) => {
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? new Date(expiresAt).getTime() - Date.now() : 0
  );

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => {
      setRemaining(new Date(expiresAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return useMemo(() => {
    if (!expiresAt || remaining <= 0) return null;
    const totalSeconds = Math.floor(remaining / 1000);
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [remaining, expiresAt]);
};

export const BookingCard = ({ listing, bookingInfo, admin = false }) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(bookingInfo);
  const [busy, setBusy] = useState(false);

  const countdown = useCountdown(
    booking?.status === "pending" ? booking.expiresAt : null
  );

  const seeListing = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!listing?._id) return;
    navigate(`/listing/${listing._id}`);
  };

  // Simulated payment. In production this would kick off a Stripe Checkout
  // session and the server would flip status to `confirmed` via a webhook,
  // not from the browser directly.
  const payNow = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setBusy(true);
    try {
      const { data } = await axios.post(`/api/bookings/${booking._id}/pay`);
      setBooking(data.booking);
      alert("Payment confirmed. Your booking is locked in.");
    } catch (err) {
      if (err.response?.status === 410) {
        alert("This booking has expired. Please create a new one.");
        setBooking((b) => ({ ...b, status: "expired" }));
      } else {
        alert(err.response?.data?.error || "Payment failed.");
      }
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!window.confirm("Cancel this booking?")) return;
    setBusy(true);
    try {
      const { data } = await axios.post(
        `/api/bookings/${booking._id}/cancel`
      );
      setBooking(data.booking);
    } catch (err) {
      alert(err.response?.data?.error || "Could not cancel.");
    } finally {
      setBusy(false);
    }
  };

  const showPay = booking.status === "pending";
  const showCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="card-container relative p-3">
      <button onClick={seeListing} className="w-full text-left">
        <div className="card-image-container">
          {listing?.images?.length ? (
            listing.images.map((src, i) =>
              src ? (
                <img
                  key={i}
                  src={src}
                  className="card-image object-cover"
                  alt={`slide ${i}`}
                />
              ) : null
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
              Listing no longer available
            </div>
          )}
        </div>

        <div className="card-details">
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status || "pending"} />
            {countdown && (
              <span className="text-xs text-yellow-800">
                pay within {countdown}
              </span>
            )}
          </div>
          {admin && (
            <h5 className="font-normal text-[#6a6a6a]">
              Booked by: {booking.name}
            </h5>
          )}
          <h5 className="font-normal text-[#6a6a6a]">
            Check-In: {format(new Date(booking.checkIn), "yyyy-MM-dd")}
          </h5>
          <h5 className="font-normal text-[#6a6a6a]">
            Check-Out: {format(new Date(booking.checkOut), "yyyy-MM-dd")}
          </h5>
          <p className="font-semibold">
            <span className="font-normal">Total</span> ${booking.price}
          </p>
        </div>
      </button>

      <div className="flex gap-2 mt-2">
        {showPay && (
          <button
            onClick={payNow}
            disabled={busy || !countdown}
            className="flex-1 bg-theme text-white text-sm font-semibold py-2 rounded-md disabled:opacity-50"
          >
            {busy ? "..." : "Pay now (simulated)"}
          </button>
        )}
        {showCancel && (
          <button
            onClick={cancel}
            disabled={busy}
            className="flex-1 bg-gray-200 text-gray-800 text-sm font-semibold py-2 rounded-md disabled:opacity-50"
          >
            {busy ? "..." : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
};
