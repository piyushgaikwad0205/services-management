import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

/** PATCH /api/reviews/[id]  – approve a review */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const review = await Review.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(review.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** DELETE /api/reviews/[id]  – reject / delete a review */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
