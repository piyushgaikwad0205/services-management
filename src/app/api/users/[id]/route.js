import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/** GET /api/users/[id] */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/users/[id]
 * Body can include: { name, city, profile: { bio, categoryIds, ... } }
 * Profile fields are merged with dot-notation to avoid overwriting the whole profile.
 */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const { profile: profileUpdate, ...topLevelUpdate } = body;

    const updateDoc = { ...topLevelUpdate };
    if (profileUpdate) {
      Object.entries(profileUpdate).forEach(([key, val]) => {
        updateDoc[`profile.${key}`] = val;
      });
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: updateDoc },
      { new: true }
    );
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** DELETE /api/users/[id]  – removes a provider */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
