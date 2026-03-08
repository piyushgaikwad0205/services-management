import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

/** PATCH /api/categories/[id]  – update a category */
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category.toJSON());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** DELETE /api/categories/[id]  – remove a category */
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
