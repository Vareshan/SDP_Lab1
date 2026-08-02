import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

const taskPriorities = [
  "Low",
  "Medium",
  "High",
] as const;

const taskStatuses = [
  "todo",
  "progress",
  "done",
] as const;

const taskActions = [
  "edit",
  "archive",
] as const;

type TaskPriorityValue =
  (typeof taskPriorities)[number];

type TaskStatusValue =
  (typeof taskStatuses)[number];

type TaskActionValue =
  (typeof taskActions)[number];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

function isTaskAction(
  value: unknown,
): value is TaskActionValue {
  return (
    typeof value === "string" &&
    taskActions.includes(
      value as TaskActionValue,
    )
  );
}

function isValidDateString(
  value: unknown,
): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  return !Number.isNaN(parsedDate.getTime());
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "The local user has not been created.",
        },
        { status: 404 },
      );
    }

    const existingTask =
      await prisma.task.findFirst({
        where: {
          id,
          userId: user.id,
          archivedAt: null,
        },
      });

    if (!existingTask) {
      return NextResponse.json(
        {
          error:
            "The requested task could not be found.",
        },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      action?: unknown;
      title?: unknown;
      description?: unknown;
      topic?: unknown;
      startDate?: unknown;
      dueDate?: unknown;
      timeEstimate?: unknown;
      priority?: unknown;
      status?: unknown;
    };

    if (body.action === "archive") {
      const archivedTask =
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            archivedAt: new Date(),
          },
        });

      return NextResponse.json(
        {
          message:
            "Task archived successfully.",
          task: archivedTask,
        },
        { status: 200 },
      );
    }

    if (body.action === "edit") {
      if (
        typeof body.title !== "string" ||
        body.title.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task title is required.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.description !== "string" ||
        body.description.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task description is required.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.topic !== "string" ||
        body.topic.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "A task topic is required.",
          },
          { status: 400 },
        );
      }

      if (!isValidDateString(body.startDate)) {
        return NextResponse.json(
          {
            error:
              "A valid task start date is required.",
          },
          { status: 400 },
        );
      }

      if (!isValidDateString(body.dueDate)) {
        return NextResponse.json(
          {
            error:
              "A valid task due date is required.",
          },
          { status: 400 },
        );
      }

      if (body.startDate > body.dueDate) {
        return NextResponse.json(
          {
            error:
              "The start date cannot be after the due date.",
          },
          { status: 400 },
        );
      }

      if (
        typeof body.timeEstimate !== "string" ||
        body.timeEstimate.trim().length === 0
      ) {
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
            error:
              "The task priority is invalid.",
          },
          { status: 400 },
        );
      }

      if (!isTaskStatus(body.status)) {
        return NextResponse.json(
          {
            error:
              "The task status is invalid.",
          },
          { status: 400 },
        );
      }

      const updatedTask =
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            title: body.title.trim(),
            description:
              body.description.trim(),
            topic: body.topic.trim(),
            startDate: body.startDate,
            dueDate: body.dueDate,
            timeEstimate:
              body.timeEstimate.trim(),
            priority: body.priority,
            status: body.status,
          },
        });

      return NextResponse.json(
        {
          message:
            "Task updated successfully.",
          task: updatedTask,
        },
        { status: 200 },
      );
    }

    if (
      body.action !== undefined &&
      !isTaskAction(body.action)
    ) {
      return NextResponse.json(
        {
          error:
            "The requested task action is invalid.",
        },
        { status: 400 },
      );
    }

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        {
          error:
            "A valid task status is required.",
        },
        { status: 400 },
      );
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id: existingTask.id,
        },
        data: {
          status: body.status,
        },
      });

    return NextResponse.json(
      {
        message:
          "Task status updated successfully.",
        task: updatedTask,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Failed to update task:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the task.",
      },
      { status: 500 },
    );
  }
}