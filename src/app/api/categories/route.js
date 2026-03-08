import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

/** GET /api/categories  →  all categories */
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories.map((c) => c.toJSON()));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** POST /api/categories  →  create a new category */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, id, ...data } = body;
    const category = await Category.create({
      _id: _id || id || `cat${Date.now()}`,
      ...data,
    });
    return NextResponse.json(category.toJSON(), { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
