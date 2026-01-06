import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    date: String,
    time: String,
    guests: Number,
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
