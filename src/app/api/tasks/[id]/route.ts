import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const taskStatuses = ["todo", "progress", "done"] as const;

type TaskStatusValue = (typeof taskStatuses)[number];

function isTaskStatus(value: unknown): value is TaskStatusValue {
  return (
    typeof value === "string" &&
    taskStatuses.includes(value as TaskStatusValue)
  );
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const body = (await request.json()) as {
      status?: unknown;
    };

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        {
          error: "The task status is invalid.",
        },
        { status: 400 },
      );
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          error: "The task could not be found.",
        },
        { status: 404 },
      );
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(
      {
        message: "Task status updated successfully.",
        task,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update task status:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while updating the task.",
      },
      { status: 500 },
    );
  }
}