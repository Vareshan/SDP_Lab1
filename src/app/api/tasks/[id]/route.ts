import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const taskStatuses = [
  "todo",
  "progress",
  "done",
] as const;

type TaskStatusValue =
  (typeof taskStatuses)[number];

function isTaskStatus(
  value: unknown,
): value is TaskStatusValue {
  return (
    typeof value === "string" &&
    taskStatuses.includes(
      value as TaskStatusValue,
    )
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

    const existingTask =
      await prisma.task.findUnique({
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

    const body = (await request.json()) as {
      status?: unknown;
      action?: unknown;
    };

    if (body.action === "archive") {
      if (existingTask.archivedAt) {
        return NextResponse.json(
          {
            error: "The task is already archived.",
          },
          { status: 400 },
        );
      }

      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          archivedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          message: "Task archived successfully.",
          task,
        },
        { status: 200 },
      );
    }

    if (isTaskStatus(body.status)) {
      if (existingTask.archivedAt) {
        return NextResponse.json(
          {
            error:
              "An archived task cannot be moved.",
          },
          { status: 400 },
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
          message:
            "Task status updated successfully.",
          task,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        error:
          "A valid task status or archive action is required.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Failed to update task:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the task.",
      },
      { status: 500 },
    );
  }
}