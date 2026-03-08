import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "cat1", "cat${Date.now()}"
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    basePrice: { type: Number, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

CategorySchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
