import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const taskStatuses = [
  "todo",
  "progress",
  "done",
] as const;

const taskPriorities = [
  "Low",
  "Medium",
  "High",
] as const;

type TaskStatusValue =
  (typeof taskStatuses)[number];

type TaskPriorityValue =
  (typeof taskPriorities)[number];

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

function isTaskPriority(
  value: unknown,
): value is TaskPriorityValue {
  return (
    typeof value === "string" &&
    taskPriorities.includes(
      value as TaskPriorityValue,
    )
  );
}

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
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
      action?: unknown;
      title?: unknown;
      description?: unknown;
      topic?: unknown;
      dueDate?: unknown;
      timeEstimate?: unknown;
      priority?: unknown;
      status?: unknown;
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

    if (body.action === "edit") {
      if (existingTask.archivedAt) {
        return NextResponse.json(
          {
            error:
              "An archived task cannot be edited.",
          },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(body.title)) {
        return NextResponse.json(
          {
            error: "A task title is required.",
          },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(body.description)) {
        return NextResponse.json(
          {
            error:
              "A task description is required.",
          },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(body.topic)) {
        return NextResponse.json(
          {
            error: "A task topic is required.",
          },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(body.dueDate)) {
        return NextResponse.json(
          {
            error: "A due date is required.",
          },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(body.timeEstimate)) {
        return NextResponse.json(
          {
            error:
              "A time estimate is required.",
          },
          { status: 400 },
        );
      }

      if (!isTaskPriority(body.priority)) {
        return NextResponse.json(
          {
            error: "The task priority is invalid.",
          },
          { status: 400 },
        );
      }

      if (!isTaskStatus(body.status)) {
        return NextResponse.json(
          {
            error: "The task status is invalid.",
          },
          { status: 400 },
        );
      }

      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          title: body.title.trim(),
          description: body.description.trim(),
          topic: body.topic.trim(),
          dueDate: body.dueDate.trim(),
          timeEstimate: body.timeEstimate.trim(),
          priority: body.priority,
          status: body.status,
        },
      });

      return NextResponse.json(
        {
          message: "Task updated successfully.",
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
          "A valid edit, archive or status update is required.",
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