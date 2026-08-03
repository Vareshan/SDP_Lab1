import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import prisma from "../lib/prisma";

import {
  GET as getActiveTasks,
  POST as createTask,
} from "../src/app/api/tasks/route";

import {
  PATCH as updateTask,
} from "../src/app/api/tasks/[id]/route";

import {
  GET as getArchivedTasks,
} from "../src/app/api/archive/route";

let testUserId: number;

function createJsonRequest(
  url: string,
  method: "POST" | "PATCH",
  body: object,
) {
  return new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  // Tasks must be removed first because they
  // reference users through a foreign key.
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const testUser = await prisma.user.create({
    data: {
      username: "integration-test-user",
    },
  });

  testUserId = testUser.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Task API integration tests", () => {
  it(
    "creates a task and stores it in the database",
    async () => {
      const request = createJsonRequest(
        "http://localhost/api/tasks",
        "POST",
        {
          title: "Complete testing section",
          description:
            "Add integration tests for the task tracker.",
          topic: "COMS3011A",
          startDate: "2026-08-03",
          dueDate: "2026-08-10",
          timeEstimate: "3 hours",
          priority: "High",
          status: "todo",
        },
      );

      const response = await createTask(
        request,
      );

      expect(response.status).toBe(201);

      const responseBody =
        (await response.json()) as {
          message: string;
          task: {
            id: string;
            title: string;
            description: string;
            topic: string;
            priority: string;
            status: string;
          };
        };

      expect(responseBody.message).toBe(
        "Task created successfully.",
      );

      expect(responseBody.task).toMatchObject({
        title: "Complete testing section",
        description:
          "Add integration tests for the task tracker.",
        topic: "COMS3011A",
        priority: "High",
        status: "todo",
      });

      const storedTask =
        await prisma.task.findUnique({
          where: {
            id: responseBody.task.id,
          },
        });

      expect(storedTask).not.toBeNull();

      expect(storedTask).toMatchObject({
        title: "Complete testing section",
        description:
          "Add integration tests for the task tracker.",
        topic: "COMS3011A",
        startDate: "2026-08-03",
        dueDate: "2026-08-10",
        timeEstimate: "3 hours",
        priority: "High",
        status: "todo",
        userId: testUserId,
        archivedAt: null,
      });
    },
  );

  it(
    "edits an existing task and saves the changes",
    async () => {
      const originalTask =
        await prisma.task.create({
          data: {
            title: "Original title",
            description:
              "Original task description.",
            topic: "COMS3011A",
            startDate: "2026-08-03",
            dueDate: "2026-08-10",
            timeEstimate: "1 hour",
            priority: "Low",
            status: "todo",
            userId: testUserId,
          },
        });

      const request = createJsonRequest(
        `http://localhost/api/tasks/${originalTask.id}`,
        "PATCH",
        {
          action: "edit",
          title: "Updated title",
          description:
            "Updated task description.",
          topic: "Software Design",
          startDate: "2026-08-04",
          dueDate: "2026-08-20",
          timeEstimate: "4 hours",
          priority: "High",
          status: "progress",
        },
      );

      const response = await updateTask(
        request,
        {
          params: Promise.resolve({
            id: originalTask.id,
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody =
        (await response.json()) as {
          message: string;
          task: {
            id: string;
            title: string;
            priority: string;
            status: string;
          };
        };

      expect(responseBody.message).toBe(
        "Task updated successfully.",
      );

      expect(responseBody.task).toMatchObject({
        id: originalTask.id,
        title: "Updated title",
        priority: "High",
        status: "progress",
      });

      const updatedTask =
        await prisma.task.findUnique({
          where: {
            id: originalTask.id,
          },
        });

      expect(updatedTask).toMatchObject({
        title: "Updated title",
        description:
          "Updated task description.",
        topic: "Software Design",
        startDate: "2026-08-04",
        dueDate: "2026-08-20",
        timeEstimate: "4 hours",
        priority: "High",
        status: "progress",
      });
    },
  );

  it(
    "archives a task, removes it from active tasks and adds it to the archive",
    async () => {
      const completedTask =
        await prisma.task.create({
          data: {
            title: "Completed task",
            description:
              "A completed task ready to be archived.",
            topic: "COMS3011A",
            startDate: "2026-08-01",
            dueDate: "2026-08-03",
            timeEstimate: "2 hours",
            priority: "Medium",
            status: "done",
            userId: testUserId,
          },
        });

      const archiveRequest =
        createJsonRequest(
          `http://localhost/api/tasks/${completedTask.id}`,
          "PATCH",
          {
            action: "archive",
          },
        );

      const archiveResponse =
        await updateTask(
          archiveRequest,
          {
            params: Promise.resolve({
              id: completedTask.id,
            }),
          },
        );

      expect(
        archiveResponse.status,
      ).toBe(200);

      const archiveResponseBody =
        (await archiveResponse.json()) as {
          message: string;
          task: {
            id: string;
            archivedAt: string | null;
          };
        };

      expect(
        archiveResponseBody.message,
      ).toBe(
        "Task archived successfully.",
      );

      expect(
        archiveResponseBody.task.archivedAt,
      ).not.toBeNull();

      const storedArchivedTask =
        await prisma.task.findUnique({
          where: {
            id: completedTask.id,
          },
        });

      expect(
        storedArchivedTask?.archivedAt,
      ).toBeInstanceOf(Date);

      // Archived task should not be returned
      // by the active-task endpoint.
      const activeResponse =
        await getActiveTasks();

      expect(activeResponse.status).toBe(200);

      const activeBody =
        (await activeResponse.json()) as {
          tasks: Array<{
            id: string;
          }>;
        };

      expect(
        activeBody.tasks.some(
          (task) =>
            task.id === completedTask.id,
        ),
      ).toBe(false);

      // Archived task should be returned
      // by the archive endpoint.
      const archivedResponse =
        await getArchivedTasks();

      expect(
        archivedResponse.status,
      ).toBe(200);

      const archivedBody =
        (await archivedResponse.json()) as {
          tasks: Array<{
            id: string;
          }>;
        };

      expect(
        archivedBody.tasks.some(
          (task) =>
            task.id === completedTask.id,
        ),
      ).toBe(true);
    },
  );
});