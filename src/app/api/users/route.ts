import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve user:", error);

    return NextResponse.json(
      {
        user: null,
        error: "Something went wrong while retrieving the user.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const existingUser = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "The local user already exists.",
          user: existingUser,
        },
        { status: 200 }
      );
    }

    const body = (await request.json()) as {
      username?: unknown;
    };

    if (typeof body.username !== "string") {
      return NextResponse.json(
        {
          error: "A username is required.",
        },
        { status: 400 }
      );
    }

    const username = body.username.trim();

    if (username.length < 2 || username.length > 30) {
      return NextResponse.json(
        {
          error: "The username must contain between 2 and 30 characters.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        username,
      },
    });

    return NextResponse.json(
      {
        message: "User saved successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save user:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the user.",
      },
      { status: 500 }
    );
  }
}