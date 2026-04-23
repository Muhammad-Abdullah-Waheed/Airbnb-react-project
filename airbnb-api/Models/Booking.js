const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Airbnblistings',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: Number,
    guestCount: Number,

    // Booking lifecycle. A booking does NOT truly block the dates until it is
    // `confirmed` (i.e. paid). A `pending` booking only holds the dates until
    // `expiresAt`; after that, other guests can book the same period.
    //   pending   -> created, awaiting payment
    //   confirmed -> paid, dates are locked
    //   cancelled -> either user or host cancelled
    //   expired   -> pending booking timed out before payment
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'expired'],
      default: 'pending',
      index: true,
    },

    // For `pending` bookings, when the hold releases. Null for confirmed
    // bookings because they no longer expire.
    expiresAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
