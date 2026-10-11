import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments({});

    return NextResponse.json({
      success: true,
      count: totalUsers,
    });
  } catch (error) {
    console.error("Error counting users:", error);

    return NextResponse.json(
      
      {
        success: false,
        message: "تعذّر جلب عدد المواطنين",
      },
      { status: 500 }
    );
  }
}