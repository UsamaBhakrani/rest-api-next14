import { connect } from "@/lib/db";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const AllUsers = await User.find();
    return new NextResponse(JSON.stringify(AllUsers), { status: 200 });
  } catch (error) {}
  return new NextResponse("Error in Fetching Users", { status: 500 });
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();

    if (!userId || !newUsername)
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        { status: 404 }
      );

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid UserId" }), {
        status: 404,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not Found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User is Updated", user: updatedUser })
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Error From Server" }), {
      status: 404,
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    await connect();

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Id or Username not Found" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid UserId" }), {
        status: 400,
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    return new NextResponse(
      JSON.stringify({ message: "User deleted", user: deletedUser }),
      {
        status: 200,
      }
    );
    
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Error From Server" }), {
      status: 404,
    });
  }
};
