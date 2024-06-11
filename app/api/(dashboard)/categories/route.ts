import { connect } from "@/lib/db";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/models/category";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Id or Username not Found" }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not Found" }), {
        status: 400,
      });
    }
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in Fetching Users", { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Id or Username not Found" }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not Found" }), {
        status: 404,
      });
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();
    return new NextResponse(
      JSON.stringify({
        message: "New Category Created",
        category: newCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse("Error in Fetching Categories", { status: 500 });
  }
};
