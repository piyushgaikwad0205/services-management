import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ROLES } from "@/lib/data";

/** POST /api/auth/register  →  { user } | { error } */
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role, city } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "name, email, password and role are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      _id: `u${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      city: city?.trim() || "",
      avatar: null,
      ...(role === ROLES.PROVIDER
        ? {
            profile: {
              bio: "",
              categoryIds: [],
              experience: 0,
              isAvailable: false,
              isApproved: false,
              rating: 0,
              reviewCount: 0,
              areas: [],
            },
          }
        : {}),
    });

    return NextResponse.json({ user: newUser.toJSON() }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
