import mongoose, { Schema, models } from "mongoose";

const ReservationSchema = new Schema(
  {
    name: String,
    phone: String,
    date: String, // YYYY-MM-DD
    time: String, // HH:mm
    guests: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
