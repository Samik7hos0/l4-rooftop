import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },

    // ✅ SUPPORT BOTH OLD + NEW DATA
    note: {
      type: String,
      default: "",
    },

    specialRequest: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["confirmed", "pending"],
      default: "pending",
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
