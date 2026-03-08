import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import bcrypt from "bcryptjs";
import {
  initialUsers,
  initialCategories,
  initialBookings,
  initialReviews,
} from "@/lib/data";

/**
 * POST /api/seed
 * Seeds the MongoDB database with initial demo data.
 * Idempotent – won't run if users already exist.
 * Call once after setting up your Atlas cluster:
 *   fetch('/api/seed', { method: 'POST' })
 */
export async function POST() {
  try {
    await connectDB();

    // Guard: don't double-seed
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json({
        message: "Database already seeded – skipped.",
        seeded: false,
      });
    }

    // Hash passwords before inserting
    const usersToInsert = await Promise.all(
      initialUsers.map(async ({ id, ...user }) => ({
        _id: id,
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(usersToInsert);
    await Category.insertMany(
      initialCategories.map(({ id, ...cat }) => ({ _id: id, ...cat }))
    );
    await Booking.insertMany(
      initialBookings.map(({ id, ...b }) => ({ _id: id, ...b }))
    );
    await Review.insertMany(
      initialReviews.map(({ id, ...r }) => ({ _id: id, ...r }))
    );

    return NextResponse.json({
      message: "✅ Database seeded successfully!",
      counts: {
        users: usersToInsert.length,
        categories: initialCategories.length,
        bookings: initialBookings.length,
        reviews: initialReviews.length,
      },
      seeded: true,
    });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
