import mongoose from "mongoose";

// Sub-schema for provider-specific profile data
const ProviderProfileSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    categoryIds: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    areas: { type: [String], default: [] },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "u1", "u${Date.now()}"
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "provider", "admin"], required: true },
    city: { type: String, default: "" },
    avatar: { type: String, default: null },
    profile: { type: ProviderProfileSchema, default: null },
  },
  { timestamps: true }
);

// Strip password and rename _id → id in all JSON output
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
