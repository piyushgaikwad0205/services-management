import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "r1", "r${Date.now()}"
    bookingId: { type: String, required: true },
    customerId: { type: String, required: true },
    providerId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.createdAt = ret.createdAt?.toISOString?.() ?? ret.createdAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
