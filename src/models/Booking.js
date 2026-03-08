import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "b1", "b${Date.now()}"
    customerId: { type: String, required: true },
    providerId: { type: String, required: true },
    categoryId: { type: String, required: true },
    status: {
      type: String,
      enum: ["Requested", "Confirmed", "In-progress", "Completed", "Cancelled"],
      default: "Requested",
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: "" },
    price: { type: Number, required: true },
    workNotes: { type: String, default: "" },
    images: { type: [String], default: [] },
    beforeImages: { type: [String], default: [] },
    afterImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

BookingSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.createdAt = ret.createdAt?.toISOString?.() ?? ret.createdAt;
    ret.updatedAt = ret.updatedAt?.toISOString?.() ?? ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
