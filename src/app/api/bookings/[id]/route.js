import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

/** GET /api/bookings/[id] */
export async function GET(req, { params }) {
  try {
    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(booking.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** PATCH /api/bookings/[id]  – update status, workNotes, etc. */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(booking.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
