-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "project" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "timeEstimate" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "archivedAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("archivedAt", "createdAt", "dueDate", "id", "priority", "project", "status", "timeEstimate", "title", "updatedAt", "userId") SELECT "archivedAt", "createdAt", "dueDate", "id", "priority", "project", "status", "timeEstimate", "title", "updatedAt", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
