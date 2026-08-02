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
        { status: 404 }
      );
    }

    const tasks = await prisma.task.findMany({
  where: {
    userId: user.id,
    archivedAt: null,
  },
  orderBy: {
    createdAt: "desc",
  },
});

    return NextResponse.json(
      {
        tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve tasks:", error);

    return NextResponse.json(
      {
        tasks: [],
        error: "Something went wrong while retrieving the tasks.",
      },
      { status: 500 }
    );
  }
}

const taskPriorities = ["Low", "Medium", "High"] as const;
const taskStatuses = ["todo", "progress", "done"] as const;

type TaskPriorityValue = (typeof taskPriorities)[number];
type TaskStatusValue = (typeof taskStatuses)[number];

function isTaskPriority(value: unknown): value is TaskPriorityValue {
  return (
    typeof value === "string" &&
    taskPriorities.includes(value as TaskPriorityValue)
  );
}

function isTaskStatus(value: unknown): value is TaskStatusValue {
  return (
    typeof value === "string" &&
    taskStatuses.includes(value as TaskStatusValue)
  );
}

export async function POST(request: Request) {
  try {
    const user = await prisma.user.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "The local user has not been created.",
        },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      title?: unknown;
      project?: unknown;
      dueDate?: unknown;
      timeEstimate?: unknown;
      priority?: unknown;
      status?: unknown;
    };

    if (
      typeof body.title !== "string" ||
      body.title.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A task title is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body.project !== "string" ||
      body.project.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A project is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body.dueDate !== "string" ||
      body.dueDate.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A due date is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body.timeEstimate !== "string" ||
      body.timeEstimate.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: "A time estimate is required.",
        },
        { status: 400 }
      );
    }

    if (!isTaskPriority(body.priority)) {
      return NextResponse.json(
        {
          error: "The task priority is invalid.",
        },
        { status: 400 }
      );
    }

    if (!isTaskStatus(body.status)) {
      return NextResponse.json(
        {
          error: "The task status is invalid.",
        },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        project: body.project.trim(),
        dueDate: body.dueDate.trim(),
        timeEstimate: body.timeEstimate.trim(),
        priority: body.priority,
        status: body.status,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Task created successfully.",
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create task:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while creating the task.",
      },
      { status: 500 }
    );
  }
}