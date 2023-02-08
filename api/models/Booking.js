const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  noOfGuests: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  price: Number,
});

const BookingModel = mongoose.model("Bookings", bookingSchema);

module.exports = BookingModel;
