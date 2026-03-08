import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import User from "@/models/User";

/** GET /api/reviews  →  all reviews newest first */
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reviews.map((r) => r.toJSON()));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/reviews  →  create a review and recalculate provider rating
 */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, id, ...data } = body;

    const review = await Review.create({
      _id: _id || id || `r${Date.now()}`,
      ...data,
      isApproved: true,
    });

    // Recalculate provider's average rating from all approved reviews
    const providerReviews = await Review.find({
      providerId: data.providerId,
      isApproved: true,
    });
    const avg =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) /
      providerReviews.length;

    await User.findByIdAndUpdate(data.providerId, {
      $set: {
        "profile.rating": Math.round(avg * 10) / 10,
        "profile.reviewCount": providerReviews.length,
      },
    });

    return NextResponse.json(review.toJSON(), { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
