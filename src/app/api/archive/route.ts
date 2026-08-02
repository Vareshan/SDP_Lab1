import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          tasks: [],
          error: "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        archivedAt: {
          not: null,
        },
      },
      orderBy: {
        archivedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        tasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve archived tasks:",
      error,
    );

    return NextResponse.json(
      {
        tasks: [],
        error:
          "Something went wrong while retrieving archived tasks.",
      },
      { status: 500 },
    );
  }
}