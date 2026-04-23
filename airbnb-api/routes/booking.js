const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../Models/Booking");
const Listing = require("../Models/Listing");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// How long a `pending` booking holds the dates before it auto-expires and
// frees them up for other guests. In a real system this would mirror the
// payment gateway's authorization window.
const PENDING_HOLD_MS = 15 * 60 * 1000; // 15 minutes

// Lazily marks any pending bookings whose hold has expired as `expired`, so
// they no longer block new bookings on the same dates. Called at the start
// of every booking-related request. Cheap: it's indexed on status+expiresAt.
const expireStaleBookings = async (now = new Date()) => {
  await Booking.updateMany(
    { status: "pending", expiresAt: { $lte: now } },
    { $set: { status: "expired" } }
  );
};

// The "is this date range already booked?" check. We only consider bookings
// that ACTUALLY block the calendar:
//   - confirmed (paid) bookings always block.
//   - pending bookings only block while their hold is still valid.
// cancelled/expired bookings never block.
const findOverlap = async (listingId, checkIn, checkOut, now = new Date()) =>
  Booking.findOne({
    place: listingId,
    checkIn: { $lte: checkOut },
    checkOut: { $gte: checkIn },
    $or: [
      { status: "confirmed" },
      { status: "pending", expiresAt: { $gt: now } },
    ],
  });

// Admin-only: returns every booking in the system. Requires a verified JWT
// AND admin role, otherwise this would leak every guest's data.
router.get("/allBookings", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: admin only" });
    }
    await expireStaleBookings();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching bookings" });
  }
});

// A user can only fetch their own bookings; admins can fetch anyone's.
router.get("/bookings/user/:Id", verifyToken, async (req, res) => {
  const { Id } = req.params;

  try {
    if (!Id) {
      return res.status(400).json({ error: "Guest ID is required" });
    }

    if (String(req.user.id) !== String(Id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await expireStaleBookings();
    const bookings = await Booking.find({ user: Id }).sort({ createdAt: -1 });

    // "No bookings" is a valid state, not an error. Return 200 with an empty
    // array so the frontend can render an empty state instead of a fail path.
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching bookings" });
  }
});

// Create a booking. It starts as `pending` with a 15-minute payment window.
// If the guest doesn't pay within that window, it auto-expires and the dates
// become available again.
router.post("/savebooking", verifyToken, async (req, res) => {
  const { listingId, checkInDate, checkOutDate, guestName, phone, guestCount } =
    req.body;

  if (
    !listingId ||
    !guestName ||
    !phone ||
    !checkInDate ||
    !checkOutDate ||
    !guestCount
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    return res.status(400).json({ error: "Invalid listing id" });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return res.status(400).json({ error: "Invalid check-in/check-out dates" });
  }

  if (checkIn >= checkOut) {
    return res
      .status(400)
      .json({ error: "Check-in date must be before check-out date" });
  }

  try {
    const now = new Date();

    // Always expire stale pending holds before checking, otherwise a dead
    // booking from 20 min ago could still appear to block dates.
    await expireStaleBookings(now);

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const overlap = await findOverlap(listingId, checkIn, checkOut, now);
    if (overlap) {
      return res.status(409).json({
        error: "This place is already booked for the selected dates.",
      });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.max(
      1,
      Math.ceil((checkOut - checkIn) / msPerDay)
    );
    const totalPrice = Number(listing.price) * totalNights;

    const newBooking = new Booking({
      place: listingId,
      user: req.user.id,
      checkIn,
      checkOut,
      name: guestName,
      phone,
      price: totalPrice,
      guestCount,
      status: "pending",
      expiresAt: new Date(now.getTime() + PENDING_HOLD_MS),
    });

    const booking = await newBooking.save();

    return res.status(201).json({
      message:
        "Booking created. Please complete payment within 15 minutes to confirm.",
      booking,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Simulated payment confirmation. In production this endpoint would be hit
// by your payment provider's webhook (e.g. Stripe's `checkout.session.completed`)
// after the charge actually succeeds — never trusted from the client.
// For the project, we expose it to the booking owner directly.
router.post("/bookings/:id/pay", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    await expireStaleBookings();

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (
      String(booking.user) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (booking.status === "confirmed") {
      return res.status(200).json({ message: "Booking already confirmed", booking });
    }

    if (booking.status !== "pending") {
      return res
        .status(409)
        .json({ error: `Cannot pay a ${booking.status} booking.` });
    }

    // Guard against paying for a booking whose hold expired a millisecond ago.
    if (booking.expiresAt && booking.expiresAt <= new Date()) {
      booking.status = "expired";
      await booking.save();
      return res
        .status(410)
        .json({ error: "This booking has expired. Please create a new one." });
    }

    // Extra safety: before confirming, re-check that no other confirmed
    // booking slipped in for the same range.
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      place: booking.place,
      status: "confirmed",
      checkIn: { $lte: booking.checkOut },
      checkOut: { $gte: booking.checkIn },
    });
    if (conflict) {
      booking.status = "cancelled";
      await booking.save();
      return res.status(409).json({
        error:
          "Another guest confirmed this place while you were paying. You have not been charged.",
      });
    }

    booking.status = "confirmed";
    booking.expiresAt = null;
    await booking.save();

    return res.status(200).json({ message: "Payment confirmed", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Cancel a booking. Owner or admin only. Cancellation frees up the dates
// immediately (a real product would have a refund policy here).
router.post("/bookings/:id/cancel", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (
      String(booking.user) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (booking.status === "cancelled" || booking.status === "expired") {
      return res
        .status(200)
        .json({ message: `Booking already ${booking.status}`, booking });
    }

    booking.status = "cancelled";
    booking.expiresAt = null;
    await booking.save();

    return res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
