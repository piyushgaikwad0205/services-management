import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/** GET /api/users  →  all users (passwords stripped) */
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json(users.map((u) => u.toJSON()));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
