import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

/** GET /api/bookings  →  all bookings newest first */
export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings.map((b) => b.toJSON()));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** POST /api/bookings  →  create a new booking */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, id, ...data } = body;
    const booking = await Booking.create({
      _id: _id || id || `b${Date.now()}`,
      ...data,
    });
    return NextResponse.json(booking.toJSON(), { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
