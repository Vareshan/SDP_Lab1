"use client";

import {
  Archive,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDashed,
  Clock,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Moon,
  Pencil,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import UsernameForm from "./components/UsernameForm";

type Theme = "light" | "dark";
type PageView =  | "dashboard" | "task-list" | "calendar"| "archive";
type TaskStatus = "todo" | "progress" | "done";
type TaskPriority = "Low" | "Medium" | "High";
type TaskSortField = "topic" | "status" | "dueDate";
type SortDirection = "ascending" | "descending";

type Task = {
  id: string;
  title: string;
  description: string;
  topic: string;
  startDate: string | null;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
  archivedAt?: string | null;
};

type DraftTask = {
  title: string;
  description: string;
  topic: string;
  startDate: string;
  dueDate: string;
  timeEstimate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

const dismissedNotificationsStorageKey =
  "dismissed-overdue-notifications";

const taskStatusOrder: Record<TaskStatus, number> = {
  todo: 0,
  progress: 1,
  done: 2,
};

const columns: {
  status: TaskStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "todo",
    title: "To do",
    description: "Tasks that have not been started",
  },
  {
    status: "progress",
    title: "In progress",
    description: "Tasks currently being worked on",
  },
  {
    status: "done",
    title: "Completed",
    description: "Tasks that have been finished",
  },
];

const navigationItems = [
  {
    label: "Dashboard",
    href: "#dashboard",
    icon: LayoutDashboard,
    view: "dashboard" as PageView,
  },
  {
    label: "Task List",
    href: "#task-list",
    icon: ListTodo,
    view: "task-list" as PageView,
  },
  {
    label: "Archive",
    href: "#archive",
    icon: Archive,
    view: "archive" as PageView,
  },
  {
  label: "Calendar",
  href: "#calendar",
  icon: CalendarDays,
  view: "calendar" as PageView,
},
];

function createEmptyTask(
  status: TaskStatus = "todo",
): DraftTask {
  return {
    title: "",
    description: "",
    topic: "Task Tracker",
    startDate: "",
    dueDate: "",
    timeEstimate: "1h",
    priority: "Medium",
    status,
  };
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function formatArchivedDate(date: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTaskStatus(status: TaskStatus): string {
  if (status === "todo") {
    return "To do";
  }

  if (status === "progress") {
    return "In progress";
  }

  return "Completed";
}

function parseDateOnly(date: string): Date {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  const updatedDate = new Date(date);

  updatedDate.setDate(
    updatedDate.getDate() + amount,
  );

  return updatedDate;
}

function getStartOfWeek(date: Date): Date {
  const weekStart = new Date(date);

  weekStart.setHours(0, 0, 0, 0);

  const currentDay = weekStart.getDay();

  const daysFromMonday =
    currentDay === 0 ? -6 : 1 - currentDay;

  weekStart.setDate(
    weekStart.getDate() + daysFromMonday,
  );

  return weekStart;
}

function getDayDifference(
  startDate: string,
  endDate: string,
): number {
  const [startYear, startMonth, startDay] = startDate
    .split("-")
    .map(Number);

  const [endYear, endMonth, endDay] = endDate
    .split("-")
    .map(Number);

  const startTime = Date.UTC(
    startYear,
    startMonth - 1,
    startDay,
  );

  const endTime = Date.UTC(
    endYear,
    endMonth - 1,
    endDay,
  );

  return Math.round(
    (endTime - startTime) /
      (1000 * 60 * 60 * 24),
  );
}

function createInitials(username: string): string {
  const nameParts = username
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length === 0) {
    return "U";
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial =
    nameParts[nameParts.length - 1].charAt(0);

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function isTaskOverdue(task: Task): boolean {
  if (task.status === "done") {
    return false;
  }

  const dueDate = new Date(
    `${task.dueDate}T00:00:00`,
  );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function TaskStatusIcon({
  status,
}: {
  status: TaskStatus;
}) {
  if (status === "done") {
    return (
      <CheckCircle2 size={18} aria-hidden="true" />
    );
  }

  if (status === "progress") {
    return (
      <CircleDashed size={18} aria-hidden="true" />
    );
  }

  return <Circle size={18} aria-hidden="true" />;
}

function ActiveTaskCard({
  task,
  username,
  onAdvance,
  onArchive,
  onEdit,
}: {
  task: Task;
  username: string;
  onAdvance: (taskId: string) => Promise<void>;
  onArchive: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
}) {
  const initials = createInitials(username);
  const overdue = isTaskOverdue(task);

  const actionLabel =
    task.status === "todo"
      ? "Move task to in progress"
      : task.status === "progress"
        ? "Mark task as completed"
        : "Task has been completed";

  return (
    <article
      className={`task-card ${
        overdue ? "task-card-overdue" : ""
      }`}
    >
      <header className="task-card-header">
        <figure
          className={`task-status-icon status-${task.status}`}
          aria-label={`Status: ${task.status}`}
        >
          <TaskStatusIcon status={task.status} />
        </figure>

        <section className="task-card-actions">
          <button
            className="icon-button task-menu-button"
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            title="Edit task"
          >
            <Pencil size={17} aria-hidden="true" />
          </button>

          <button
            className="icon-button task-menu-button"
            type="button"
            onClick={() => {
              void onArchive(task.id);
            }}
            aria-label={`Archive ${task.title}`}
            title="Archive task"
          >
            <Archive size={18} aria-hidden="true" />
          </button>
        </section>
      </header>

      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <p className="task-project">
        <FolderKanban size={15} aria-hidden="true" />
        {task.topic}
      </p>

      <dl className="task-metadata">
        <dt>
          <CalendarDays size={15} aria-hidden="true" />
          Due date
        </dt>

        <dd>
          <time dateTime={task.dueDate}>
            {formatDate(task.dueDate)}
          </time>

          {overdue && (
            <strong className="overdue-label">
              Overdue
            </strong>
          )}
        </dd>

        <dt>
          <Clock size={15} aria-hidden="true" />
          Estimate
        </dt>

        <dd>{task.timeEstimate}</dd>
      </dl>

      <footer className="task-card-footer">
        <small
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} priority
        </small>

        <section className="task-card-actions">
          <strong
            className="avatar avatar-small"
            aria-label={`Task belongs to ${username}`}
            title={username}
          >
            {initials}
          </strong>

          <button
            className="advance-button"
            type="button"
            onClick={() => {
              void onAdvance(task.id);
            }}
            disabled={task.status === "done"}
            aria-label={actionLabel}
            title={actionLabel}
          >
            {task.status === "done" ? (
              <CheckCircle2
                size={17}
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                size={17}
                aria-hidden="true"
              />
            )}
          </button>
        </section>
      </footer>
    </article>
  );
}

function ArchivedTaskCard({
  task,
  username,
}: {
  task: Task;
  username: string;
}) {
  const initials = createInitials(username);

  return (
    <article className="task-card">
      <header className="task-card-header">
        <figure
          className={`task-status-icon status-${task.status}`}
          aria-label={`Final status: ${task.status}`}
        >
          <TaskStatusIcon status={task.status} />
        </figure>

        <Archive size={18} aria-hidden="true" />
      </header>

      <h4>{task.title}</h4>

      <p>{task.description}</p>

      <p className="task-project">
        <FolderKanban size={15} aria-hidden="true" />
        {task.topic}
      </p>

      <dl className="task-metadata">
        <dt>
          <CalendarDays size={15} aria-hidden="true" />
          Due date
        </dt>

        <dd>
          <time dateTime={task.dueDate}>
            {formatDate(task.dueDate)}
          </time>
        </dd>

        <dt>
          <Clock size={15} aria-hidden="true" />
          Estimate
        </dt>

        <dd>{task.timeEstimate}</dd>

        <dt>
          <Archive size={15} aria-hidden="true" />
          Archived
        </dt>

        <dd>
          {task.archivedAt
            ? formatArchivedDate(task.archivedAt)
            : "Archived"}
        </dd>
      </dl>

      <footer className="task-card-footer">
        <small
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} priority
        </small>

        <strong
          className="avatar avatar-small"
          aria-label={`Task belongs to ${username}`}
          title={username}
        >
          {initials}
        </strong>
      </footer>
    </article>
  );
}

export default function Home() {
  const [theme, setTheme] =
    useState<Theme>("light");

  const [currentView, setCurrentView] =
    useState<PageView>("dashboard");

  const [tasks, setTasks] = useState<Task[]>([]);

  const [archivedTasks, setArchivedTasks] = useState<
    Task[]
  >([]);

  const [isLoadingTasks, setIsLoadingTasks] =
    useState(true);

  const [isLoadingArchive, setIsLoadingArchive] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [taskSortField, setTaskSortField] =
    useState<TaskSortField>("dueDate");

  const [taskSortDirection, setTaskSortDirection] =
    useState<SortDirection>("ascending");

  const [
  calendarStartDate,
  setCalendarStartDate,
] = useState("");

  const [currentDate, setCurrentDate] =
    useState("Today");

  const [currentDateISO, setCurrentDateISO] =
    useState("");

  const [greeting, setGreeting] =
    useState("Good day");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingTaskId, setEditingTaskId] = useState<
    string | null
  >(null);

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    dismissedNotificationIds,
    setDismissedNotificationIds,
  ] = useState<string[]>([]);

  const [username, setUsername] = useState<
    string | null
  >(null);

  const [isCheckingUser, setIsCheckingUser] =
    useState(true);

  const [draftTask, setDraftTask] = useState<DraftTask>(
    createEmptyTask(),
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSavedUser(): Promise<void> {
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          user: {
            username: string;
          } | null;
          error?: string;
        };

        if (!isMounted) {
          return;
        }

        if (response.ok && data.user) {
          setUsername(data.user.username);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error(
          "Failed to load saved user:",
          error,
        );

        if (isMounted) {
          setUsername(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingUser(false);
        }
      }
    }

    void loadSavedUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isCheckingUser || !username) {
      return;
    }

    let isMounted = true;

    async function loadTasks(): Promise<void> {
      try {
        setIsLoadingTasks(true);

        const response = await fetch("/api/tasks", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          tasks: Task[];
          error?: string;
        };

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          console.error(
            data.error ?? "Failed to load tasks.",
          );

          setTasks([]);
          return;
        }

        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);

        if (isMounted) {
          setTasks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTasks(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, [isCheckingUser, username]);

  useEffect(() => {
    try {
      const savedDismissedIds = localStorage.getItem(
        dismissedNotificationsStorageKey,
      );

      if (!savedDismissedIds) {
        return;
      }

      const parsedIds = JSON.parse(
        savedDismissedIds,
      ) as unknown;

      if (
        Array.isArray(parsedIds) &&
        parsedIds.every(
          (taskId) => typeof taskId === "string",
        )
      ) {
        setDismissedNotificationIds(parsedIds);
      }
    } catch (error) {
      console.error(
        "Failed to load dismissed notifications:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    if (
      currentView !== "archive" ||
      isCheckingUser ||
      !username
    ) {
      return;
    }

    let isMounted = true;

    async function loadArchivedTasks(): Promise<void> {
      try {
        setIsLoadingArchive(true);

        const response = await fetch("/api/archive", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as {
          tasks: Task[];
          error?: string;
        };

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          console.error(
            data.error ??
              "Failed to load archived tasks.",
          );

          setArchivedTasks([]);
          return;
        }

        setArchivedTasks(data.tasks);
      } catch (error) {
        console.error(
          "Failed to load archived tasks:",
          error,
        );

        if (isMounted) {
          setArchivedTasks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingArchive(false);
        }
      }
    }

    void loadArchivedTasks();

    return () => {
      isMounted = false;
    };
  }, [currentView, isCheckingUser, username]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "task-tracker-theme",
    ) as Theme | null;

    const systemTheme: Theme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
      ? "dark"
      : "light";

    const selectedTheme = savedTheme ?? systemTheme;

    setTheme(selectedTheme);

    document.documentElement.dataset.theme =
      selectedTheme;

    const now = new Date();
    const hour = now.getHours();

    const todayISO = formatDateInput(now);

setCurrentDateISO(todayISO);

setCalendarStartDate(
  formatDateInput(getStartOfWeek(now)),
);

    setCurrentDate(
      new Intl.DateTimeFormat("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now),
    );

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.topic.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, tasks]);

  const sortedTasks = useMemo(() => {
    const tasksToSort = [...filteredTasks];

    tasksToSort.sort((firstTask, secondTask) => {
      let comparison = 0;

      if (taskSortField === "topic") {
        comparison = firstTask.topic.localeCompare(
          secondTask.topic,
          "en",
          {
            sensitivity: "base",
          },
        );
      }

      if (taskSortField === "status") {
        comparison =
          taskStatusOrder[firstTask.status] -
          taskStatusOrder[secondTask.status];
      }

      if (taskSortField === "dueDate") {
        const firstDueDate = new Date(
          `${firstTask.dueDate}T00:00:00`,
        ).getTime();

        const secondDueDate = new Date(
          `${secondTask.dueDate}T00:00:00`,
        ).getTime();

        comparison = firstDueDate - secondDueDate;
      }

      return taskSortDirection === "ascending"
        ? comparison
        : -comparison;
    });

    return tasksToSort;
  }, [
    filteredTasks,
    taskSortDirection,
    taskSortField,
  ]);

  const calendarDays = useMemo(() => {
    if (!calendarStartDate) {
      return [];
    }

    const firstDate = parseDateOnly(
      calendarStartDate,
    );

    return Array.from(
      {
        length: 30,
      },
      (_, index) => {
        const date = addDays(firstDate, index);
        const isoDate = formatDateInput(date);
        const previousDate =
          index === 0
            ? null
            : addDays(firstDate, index - 1);

        const isMonthStart =
          previousDate === null ||
          previousDate.getMonth() !==
            date.getMonth() ||
          previousDate.getFullYear() !==
            date.getFullYear();

        const weekdayNumber = date.getDay();

        return {
          isoDate,

          weekday: new Intl.DateTimeFormat(
            "en-ZA",
            {
              weekday: "short",
            },
          ).format(date),

          dayNumber: new Intl.DateTimeFormat(
            "en-ZA",
            {
              day: "numeric",
            },
          ).format(date),

          month: new Intl.DateTimeFormat(
            "en-ZA",
            {
              month: "short",
            },
          ).format(date),

          monthKey: `${date.getFullYear()}-${date.getMonth()}`,

          monthLabel: new Intl.DateTimeFormat(
            "en-ZA",
            {
              month: "long",
              year: "numeric",
            },
          ).format(date),

          fullLabel: new Intl.DateTimeFormat(
            "en-ZA",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            },
          ).format(date),

          isToday: isoDate === currentDateISO,
          isWeekend:
            weekdayNumber === 0 ||
            weekdayNumber === 6,
          isMonthStart,
        };
      },
    );
  }, [calendarStartDate, currentDateISO]);

  const calendarMonthSegments = useMemo(() => {
    const segments: {
      key: string;
      label: string;
      startIndex: number;
      dayCount: number;
    }[] = [];

    calendarDays.forEach((day, index) => {
      const currentSegment =
        segments[segments.length - 1];

      if (
        currentSegment &&
        currentSegment.key === day.monthKey
      ) {
        currentSegment.dayCount += 1;
        return;
      }

      segments.push({
        key: day.monthKey,
        label: day.monthLabel,
        startIndex: index,
        dayCount: 1,
      });
    });

    return segments;
  }, [calendarDays]);

const calendarRangeLabel = useMemo(() => {
  if (calendarDays.length === 0) {
    return "Calendar timeline";
  }

  const firstDay = parseDateOnly(
    calendarDays[0].isoDate,
  );

  const lastDay = parseDateOnly(
    calendarDays[calendarDays.length - 1].isoDate,
  );

  const rangeFormatter =
    new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return `${rangeFormatter.format(
    firstDay,
  )} – ${rangeFormatter.format(lastDay)}`;
}, [calendarDays]);

const calendarTasks = useMemo(() => {
  if (calendarDays.length === 0) {
    return [];
  }

  const firstVisibleDate =
    calendarDays[0].isoDate;

  const lastVisibleDate =
    calendarDays[
      calendarDays.length - 1
    ].isoDate;

  return filteredTasks
    .filter((task) => {
      const taskStartDate =
        task.startDate ?? task.dueDate;

      return (
        task.dueDate >= firstVisibleDate &&
        taskStartDate <= lastVisibleDate
      );
    })
    .sort((firstTask, secondTask) => {
      const topicComparison =
        firstTask.topic.localeCompare(
          secondTask.topic,
          "en",
          {
            sensitivity: "base",
          },
        );

      if (topicComparison !== 0) {
        return topicComparison;
      }

      const firstStartDate =
        firstTask.startDate ??
        firstTask.dueDate;

      const secondStartDate =
        secondTask.startDate ??
        secondTask.dueDate;

      return firstStartDate.localeCompare(
        secondStartDate,
      );
    })
    .map((task) => {
      const taskStartDate =
        task.startDate ?? task.dueDate;

      const visibleStartDate =
        taskStartDate < firstVisibleDate
          ? firstVisibleDate
          : taskStartDate;

      const visibleEndDate =
        task.dueDate > lastVisibleDate
          ? lastVisibleDate
          : task.dueDate;

      return {
        task,

        startIndex: getDayDifference(
          firstVisibleDate,
          visibleStartDate,
        ),

        endIndex: getDayDifference(
          firstVisibleDate,
          visibleEndDate,
        ),

        continuesBefore:
          taskStartDate < firstVisibleDate,

        continuesAfter:
          task.dueDate > lastVisibleDate,
      };
    });
}, [calendarDays, filteredTasks]);

const calendarTaskGroups = useMemo(() => {
  const groups = new Map<
    string,
    (typeof calendarTasks)[number][]
  >();

  calendarTasks.forEach((calendarTask) => {
    const topic = calendarTask.task.topic.trim();

    const existingTasks = groups.get(topic) ?? [];

    groups.set(topic, [
      ...existingTasks,
      calendarTask,
    ]);
  });

  return Array.from(groups.entries())
    .sort(([firstTopic], [secondTopic]) =>
      firstTopic.localeCompare(
        secondTopic,
        "en",
        {
          sensitivity: "base",
        },
      ),
    )
    .map(([topic, groupedTasks]) => ({
      topic,
      tasks: groupedTasks,
    }));
}, [calendarTasks]);

  const filteredArchivedTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return archivedTasks;
    }

    return archivedTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.topic.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [archivedTasks, searchTerm]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((task) =>
      isTaskOverdue(task),
    );
  }, [tasks]);

  const visibleOverdueTasks = useMemo(() => {
    return overdueTasks.filter(
      (task) =>
        !dismissedNotificationIds.includes(task.id),
    );
  }, [dismissedNotificationIds, overdueTasks]);

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "progress",
  ).length;

  const remainingHighPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" &&
      task.status !== "done",
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100,
        );


  function changeTaskSort(
    selectedField: TaskSortField,
  ): void {
    if (taskSortField === selectedField) {
      setTaskSortDirection((currentDirection) =>
        currentDirection === "ascending"
          ? "descending"
          : "ascending",
      );

      return;
    }

    setTaskSortField(selectedField);
    setTaskSortDirection("ascending");
  }

  function moveCalendar(
  numberOfDays: number,
): void {
  if (!calendarStartDate) {
    return;
  }

  const currentStart = parseDateOnly(
    calendarStartDate,
  );

  const updatedStart = addDays(
    currentStart,
    numberOfDays,
  );

  setCalendarStartDate(
    formatDateInput(updatedStart),
  );
}

function resetCalendarToToday(): void {
  const today = new Date();

  setCalendarStartDate(
    formatDateInput(getStartOfWeek(today)),
  );
}

  function toggleTheme(): void {
    const newTheme: Theme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem(
      "task-tracker-theme",
      newTheme,
    );

    document.documentElement.dataset.theme = newTheme;
  }

  function openTaskModal(
    status: TaskStatus = "todo",
  ): void {
    setEditingTaskId(null);
    setDraftTask(createEmptyTask(status));
    setIsModalOpen(true);
  }

  function openEditTaskModal(task: Task): void {
    setEditingTaskId(task.id);

    setDraftTask({
      title: task.title,
      description: task.description,
      topic: task.topic,
      startDate: task.startDate ?? task.dueDate,
      dueDate: task.dueDate,
      timeEstimate: task.timeEstimate,
      priority: task.priority,
      status: task.status,
    });

    setIsModalOpen(true);
  }

  function closeTaskModal(): void {
    setIsModalOpen(false);
    setEditingTaskId(null);
    setDraftTask(createEmptyTask());
  }

  function dismissNotification(taskId: string): void {
    setDismissedNotificationIds((currentIds) => {
      if (currentIds.includes(taskId)) {
        return currentIds;
      }

      const updatedIds = [...currentIds, taskId];

      try {
        localStorage.setItem(
          dismissedNotificationsStorageKey,
          JSON.stringify(updatedIds),
        );
      } catch (error) {
        console.error(
          "Failed to save dismissed notifications:",
          error,
        );
      }

      return updatedIds;
    });
  }

  async function submitTask(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !draftTask.title.trim() ||
      !draftTask.description.trim() ||
      !draftTask.topic.trim() ||
      !draftTask.startDate ||
      !draftTask.dueDate ||
      !draftTask.timeEstimate.trim()
    ) {
      return;
    }

    if (draftTask.startDate > draftTask.dueDate) {
      return;
    }

    const requestBody = {
      title: draftTask.title.trim(),
      description: draftTask.description.trim(),
      topic: draftTask.topic.trim(),
      startDate: draftTask.startDate,
      dueDate: draftTask.dueDate,
      timeEstimate:
        draftTask.timeEstimate.trim(),
      priority: draftTask.priority,
      status: draftTask.status,
    };

    try {
      if (editingTaskId) {
        const response = await fetch(
          `/api/tasks/${editingTaskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "edit",
              ...requestBody,
            }),
          },
        );

        const data = (await response.json()) as {
          task?: Task;
          error?: string;
        };

        if (!response.ok || !data.task) {
          console.error(
            data.error ??
              "The task could not be updated.",
          );

          return;
        }

        const updatedTask = data.task;

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id
              ? updatedTask
              : task,
          ),
        );

        closeTaskModal();
        return;
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = (await response.json()) as {
        task?: Task;
        error?: string;
      };

      if (!response.ok || !data.task) {
        console.error(
          data.error ??
            "The task could not be created.",
        );

        return;
      }

      const createdTask = data.task;

      setTasks((currentTasks) => [
        createdTask,
        ...currentTasks,
      ]);

      closeTaskModal();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }

  async function advanceTask(
    taskId: string,
  ): Promise<void> {
    const selectedTask = tasks.find(
      (task) => task.id === taskId,
    );

    if (
      !selectedTask ||
      selectedTask.status === "done"
    ) {
      return;
    }

    const newStatus: TaskStatus =
      selectedTask.status === "todo"
        ? "progress"
        : "done";

    try {
      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = (await response.json()) as {
        task?: Task;
        error?: string;
      };

      if (!response.ok || !data.task) {
        console.error(
          data.error ??
            "The task status could not be updated.",
        );

        return;
      }

      const updatedTask = data.task;

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error,
      );
    }
  }

  async function archiveTask(
    taskId: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "archive",
          }),
        },
      );

      const data = (await response.json()) as {
        task?: Task;
        error?: string;
      };

      if (!response.ok || !data.task) {
        console.error(
          data.error ??
            "The task could not be archived.",
        );

        return;
      }

      const archivedTask = data.task;

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId,
        ),
      );

      setArchivedTasks((currentTasks) => [
        archivedTask,
        ...currentTasks.filter(
          (task) => task.id !== archivedTask.id,
        ),
      ]);
    } catch (error) {
      console.error(
        "Failed to archive task:",
        error,
      );
    }
  }

  if (isCheckingUser) {
    return (
      <main>
        <p role="status" aria-live="polite">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!username) {
    return (
      <main>
        <UsernameForm onUserSaved={setUsername} />
      </main>
    );
  }

  if (isLoadingTasks) {
    return (
      <main>
        <p role="status" aria-live="polite">
          Loading your tasks...
        </p>
      </main>
    );
  }

  const userInitials = createInitials(username);
  const isEditingTask = editingTaskId !== null;

  return (
    <main
      className="dashboard-shell"
      id="dashboard"
    >
      <aside className="sidebar">
        <header className="sidebar-header">
          <a
            className="brand"
            href="#dashboard"
            aria-label="TaskFlow dashboard"
            onClick={(event) => {
              event.preventDefault();
              setCurrentView("dashboard");
            }}
          >
            <figure className="brand-icon">
              <CheckCircle2
                size={23}
                aria-hidden="true"
              />
            </figure>

            <strong className="brand-name">
              TaskFlow
            </strong>
          </a>
        </header>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          <p className="navigation-heading">
            Workspace
          </p>

          <ul>
            {navigationItems.map((item) => {
              const NavigationIcon = item.icon;
              const isActive =
                item.view === currentView;

              return (
                <li key={item.label}>
                  <a
                    className={`navigation-item ${
                      isActive
                        ? "navigation-item-active"
                        : ""
                    }`}
                    href={item.href}
                    aria-current={
                      isActive ? "page" : undefined
                    }
                    onClick={(event) => {
                      if (item.view) {
                        event.preventDefault();

                        setCurrentView(item.view);
                      }
                    }}
                  >
                    <NavigationIcon
                      size={20}
                      aria-hidden="true"
                    />

                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="sidebar-footer">

          <article className="sidebar-profile">
            <strong
              className="avatar"
              aria-label={`${username}'s profile`}
            >
              {userInitials}
            </strong>

            <header className="profile-details">
              <strong>{username}</strong>
              <small>Local account</small>
            </header>
          </article>
        </footer>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <time dateTime={currentDateISO || undefined}>
            {currentDate}
          </time>

          <section className="topbar-actions">
            <label className="search-field">
              <Search
                size={19}
                aria-hidden="true"
              />

              <input
                type="search"
                 placeholder={
  currentView === "archive"
    ? "Search archived tasks"
    : currentView === "calendar"
      ? "Search calendar tasks"
      : "Search tasks or topics"
}
                
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </label>

            <section className="notification-centre">
              <button
                className="icon-button notification-button"
                type="button"
                aria-label={`View notifications. ${visibleOverdueTasks.length} notifications`}
                aria-expanded={isNotificationsOpen}
                aria-controls="overdue-notifications"
                onClick={() =>
                  setIsNotificationsOpen(
                    (isOpen) => !isOpen,
                  )
                }
              >
                <Bell
                  size={20}
                  aria-hidden="true"
                />

                {visibleOverdueTasks.length > 0 && (
                  <small
                    className="notification-count"
                    aria-hidden="true"
                  >
                    {visibleOverdueTasks.length}
                  </small>
                )}
              </button>

              {isNotificationsOpen && (
                <aside
                  className="notification-panel"
                  id="overdue-notifications"
                  aria-labelledby="notification-heading"
                >
                  <header className="notification-panel-header">
                    <section>
                      <p className="eyebrow">
                        Deadlines
                      </p>

                      <h2 id="notification-heading">
                        Notifications
                      </h2>
                    </section>

                    <button
                      className="icon-button"
                      type="button"
                      onClick={() =>
                        setIsNotificationsOpen(false)
                      }
                      aria-label="Close notifications"
                    >
                      <X
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </header>

                  {visibleOverdueTasks.length === 0 ? (
                    <p className="notification-empty">
                      You have no notifications.
                    </p>
                  ) : (
                    <ol className="notification-list">
                      {visibleOverdueTasks.map((task) => (
                        <li key={task.id}>
                          <article className="notification-item">
                            <header>
                              <strong>
                                {task.title}
                              </strong>

                              <section className="notification-item-actions">
                                <small>Overdue</small>

                                <button
                                  className="notification-dismiss-button"
                                  type="button"
                                  onClick={() =>
                                    dismissNotification(
                                      task.id,
                                    )
                                  }
                                  aria-label={`Dismiss notification for ${task.title}`}
                                >
                                  Dismiss
                                </button>
                              </section>
                            </header>

                            <p>{task.topic}</p>

                            <p>
                              Due{" "}
                              <time
                                dateTime={task.dueDate}
                              >
                                {formatDate(
                                  task.dueDate,
                                )}
                              </time>
                            </p>
                          </article>
                        </li>
                      ))}
                    </ol>
                  )}
                </aside>
              )}
            </section>

            <button
              className="icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light"
                  ? "dark"
                  : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon
                  size={20}
                  aria-hidden="true"
                />
              ) : (
                <Sun
                  size={20}
                  aria-hidden="true"
                />
              )}
            </button>

            <strong
              className="avatar topbar-avatar"
              aria-label={`${username}'s profile`}
            >
              {userInitials}
            </strong>
          </section>
        </header>

        {currentView === "dashboard" ? (
          <section className="content-container">
            <header className="welcome-section">
              <section>
                <p className="eyebrow">
                  Personal workspace
                </p>

                <h1>
                  {greeting}, {username}!
                </h1>

                <p>
                  Organise your work, manage your
                  deadlines and keep your topics
                  moving.
                </p>
              </section>

              <button
                className="primary-button"
                type="button"
                onClick={() => openTaskModal()}
              >
                <Plus
                  size={19}
                  aria-hidden="true"
                />

                New task
              </button>
            </header>

            <ul
              className="stats-grid"
              aria-label="Task statistics"
            >
              <li>
                <article className="stat-card">
                  <header className="stat-card-heading">
                    <figure className="stat-icon">
                      <ListTodo
                        size={20}
                        aria-hidden="true"
                      />
                    </figure>

                    <p>Total tasks</p>
                  </header>

                  <strong>{tasks.length}</strong>

                  <small>
                    Across all your topics
                  </small>
                </article>
              </li>

              <li>
                <article className="stat-card">
                  <header className="stat-card-heading">
                    <figure className="stat-icon stat-icon-progress">
                      <CircleDashed
                        size={20}
                        aria-hidden="true"
                      />
                    </figure>

                    <p>In progress</p>
                  </header>

                  <strong>{inProgressTasks}</strong>

                  <small>
                    Tasks currently active
                  </small>
                </article>
              </li>

              <li>
                <article className="stat-card">
                  <header className="stat-card-heading">
                    <figure className="stat-icon stat-icon-completed">
                      <CheckCircle2
                        size={20}
                        aria-hidden="true"
                      />
                    </figure>

                    <p>Completed</p>
                  </header>

                  <strong>{completedTasks}</strong>

                  <small>
                    Tasks successfully finished
                  </small>
                </article>
              </li>

              <li>
                <article className="stat-card">
                  <header className="stat-card-heading">
                    <figure className="stat-icon stat-icon-priority">
                      <BarChart3
                        size={20}
                        aria-hidden="true"
                      />
                    </figure>

                    <p>Overall progress</p>
                  </header>

                  <strong>
                    {completionPercentage}%
                  </strong>

                  <small>
                    {remainingHighPriorityTasks}{" "}
                    high-priority tasks remaining
                  </small>

                  <progress
                    value={completionPercentage}
                    max="100"
                    aria-label="Overall task completion"
                  >
                    {completionPercentage}%
                  </progress>
                </article>
              </li>
            </ul>

            <section
              className="board-section"
              id="tasks"
            >
              <header className="board-header">
                <section>
                  <p className="eyebrow">
                    Task management
                  </p>

                  <h2>My task board</h2>

                  <p>
                    Move tasks through each stage as
                    you complete your work.
                  </p>
                </section>

                <menu className="board-header-actions">
                  <li>
                    <small>
                      {filteredTasks.length} tasks shown
                    </small>
                  </li>

                  <li>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => openTaskModal()}
                    >
                      <Plus
                        size={18}
                        aria-hidden="true"
                      />

                      Add task
                    </button>
                  </li>
                </menu>
              </header>

              <section
                className="kanban-board"
                aria-label="Kanban task board"
              >
                {columns.map((column) => {
                  const columnTasks =
                    filteredTasks.filter(
                      (task) =>
                        task.status === column.status,
                    );

                  return (
                    <article
                      className={`task-column column-${column.status}`}
                      key={column.status}
                    >
                      <header className="column-header">
                        <section>
                          <header className="column-title-row">
                            <i
                              className="column-status-dot"
                              aria-hidden="true"
                            />

                            <h3>{column.title}</h3>

                            <small className="column-count">
                              {columnTasks.length}
                            </small>
                          </header>

                          <p>{column.description}</p>
                        </section>

                        <button
                          className="column-add-button"
                          type="button"
                          onClick={() =>
                            openTaskModal(
                              column.status,
                            )
                          }
                          aria-label={`Add task to ${column.title}`}
                        >
                          <Plus
                            size={18}
                            aria-hidden="true"
                          />
                        </button>
                      </header>

                      {columnTasks.length > 0 ? (
                        <ol className="task-list">
                          {columnTasks.map((task) => (
                            <li key={task.id}>
                              <ActiveTaskCard
                                task={task}
                                username={username}
                                onAdvance={advanceTask}
                                onArchive={archiveTask}
                                onEdit={
                                  openEditTaskModal
                                }
                              />
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <article className="empty-column">
                          <ListTodo
                            size={24}
                            aria-hidden="true"
                          />

                          <p>No tasks found</p>

                          <button
                            type="button"
                            onClick={() =>
                              openTaskModal(
                                column.status,
                              )
                            }
                          >
                            Add a task
                          </button>
                        </article>
                      )}
                    </article>
                  );
                })}
              </section>
            </section>
          </section>
        ) : currentView === "task-list" ? (
          <section
            className="content-container"
            id="task-list"
          >
            <header className="welcome-section">
              <section>
                <p className="eyebrow">
                  Task management
                </p>

                <h1>Task List</h1>

                <p>
                  View, search and organise all your
                  active tasks in one place.
                </p>
              </section>

              <button
                className="primary-button"
                type="button"
                onClick={() => openTaskModal()}
              >
                <Plus
                  size={19}
                  aria-hidden="true"
                />

                New task
              </button>
            </header>

            <section className="board-section">
              <header className="board-header">
                <section>
                  <p className="eyebrow">
                    All active tasks
                  </p>

                  <h2>Sortable task list</h2>

                  <p>
                    Sort your tasks by topic, status or
                    due date.
                  </p>
                </section>

                <small>
                  {sortedTasks.length}{" "}
                  {sortedTasks.length === 1
                    ? "task"
                    : "tasks"}{" "}
                  shown
                </small>
              </header>

              {sortedTasks.length > 0 ? (
                <section
                  className="task-table-container"
                  aria-label="Active task list"
                >
                  <table className="task-table">
                    <caption>
                      All active tasks sorted by{" "}
                      {taskSortField === "dueDate"
                        ? "due date"
                        : taskSortField}
                      .
                    </caption>

                    <thead>
                      <tr>
                        <th scope="col">Task</th>

                        <th
                          scope="col"
                          aria-sort={
                            taskSortField === "topic"
                              ? taskSortDirection
                              : "none"
                          }
                        >
                          <button
                            className="table-sort-button"
                            type="button"
                            onClick={() =>
                              changeTaskSort("topic")
                            }
                          >
                            Topic

                            <small aria-hidden="true">
                              {taskSortField === "topic"
                                ? taskSortDirection ===
                                  "ascending"
                                  ? "↑"
                                  : "↓"
                                : "↕"}
                            </small>
                          </button>
                        </th>

                        <th
                          scope="col"
                          aria-sort={
                            taskSortField === "status"
                              ? taskSortDirection
                              : "none"
                          }
                        >
                          <button
                            className="table-sort-button"
                            type="button"
                            onClick={() =>
                              changeTaskSort("status")
                            }
                          >
                            Status

                            <small aria-hidden="true">
                              {taskSortField === "status"
                                ? taskSortDirection ===
                                  "ascending"
                                  ? "↑"
                                  : "↓"
                                : "↕"}
                            </small>
                          </button>
                        </th>

                        <th
                          scope="col"
                          aria-sort={
                            taskSortField === "dueDate"
                              ? taskSortDirection
                              : "none"
                          }
                        >
                          <button
                            className="table-sort-button"
                            type="button"
                            onClick={() =>
                              changeTaskSort("dueDate")
                            }
                          >
                            Due date

                            <small aria-hidden="true">
                              {taskSortField ===
                              "dueDate"
                                ? taskSortDirection ===
                                  "ascending"
                                  ? "↑"
                                  : "↓"
                                : "↕"}
                            </small>
                          </button>
                        </th>

                        <th scope="col">Priority</th>

                        <th scope="col">Estimate</th>

                        <th scope="col">
                          <strong className="visually-hidden">
                            Task actions
                          </strong>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedTasks.map((task) => {
                        const overdue =
                          isTaskOverdue(task);

                        return (
                          <tr
                            key={task.id}
                            className={
                              overdue
                                ? "task-table-row-overdue"
                                : undefined
                            }
                          >
                            <th scope="row">
                              <article className="table-task-details">
                                <strong>
                                  {task.title}
                                </strong>

                                <p>
                                  {task.description}
                                </p>
                              </article>
                            </th>

                            <td>
                              <small className="table-topic">
                                <FolderKanban
                                  size={15}
                                  aria-hidden="true"
                                />

                                {task.topic}
                              </small>
                            </td>

                            <td>
                              <small
                                className={`table-status status-${task.status}`}
                              >
                                <TaskStatusIcon
                                  status={task.status}
                                />

                                {formatTaskStatus(
                                  task.status,
                                )}
                              </small>
                            </td>

                            <td>
                              <section className="table-due-date">
                                <time
                                  dateTime={task.dueDate}
                                >
                                  {formatDate(
                                    task.dueDate,
                                  )}
                                </time>

                                {overdue && (
                                  <strong className="overdue-label">
                                    Overdue
                                  </strong>
                                )}
                              </section>
                            </td>

                            <td>
                              <small
                                className={`priority-badge priority-${task.priority.toLowerCase()}`}
                              >
                                {task.priority}
                              </small>
                            </td>

                            <td>
                              <small>
                                <Clock
                                  size={15}
                                  aria-hidden="true"
                                />

                                {task.timeEstimate}
                              </small>
                            </td>

                            <td>
                              <menu className="table-task-actions">
                                <li>
                                  <button
                                    className="icon-button"
                                    type="button"
                                    onClick={() =>
                                      openEditTaskModal(
                                        task,
                                      )
                                    }
                                    aria-label={`Edit ${task.title}`}
                                    title="Edit task"
                                  >
                                    <Pencil
                                      size={17}
                                      aria-hidden="true"
                                    />
                                  </button>
                                </li>

                                <li>
                                  <button
                                    className="icon-button"
                                    type="button"
                                    onClick={() => {
                                      void archiveTask(
                                        task.id,
                                      );
                                    }}
                                    aria-label={`Archive ${task.title}`}
                                    title="Archive task"
                                  >
                                    <Archive
                                      size={17}
                                      aria-hidden="true"
                                    />
                                  </button>
                                </li>
                              </menu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              ) : (
                <article className="empty-column">
                  <ListTodo
                    size={28}
                    aria-hidden="true"
                  />

                  <h3>No tasks found</h3>

                  <p>
                    No active tasks match your current
                    search.
                  </p>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => openTaskModal()}
                  >
                    <Plus
                      size={18}
                      aria-hidden="true"
                    />

                    Add a task
                  </button>
                </article>
              )}
            </section>
          </section>
                ) : currentView === "calendar" ? (
          <section
            className="content-container"
            id="calendar"
          >
            <header className="welcome-section">
              <section>
                <p className="eyebrow">
                  Project planning
                </p>

                <h1>Calendar</h1>

                <p>
                  View your tasks across a horizontal
                  daily timeline.
                </p>
              </section>

              <button
                className="primary-button"
                type="button"
                onClick={() => openTaskModal()}
              >
                <Plus
                  size={19}
                  aria-hidden="true"
                />

                New task
              </button>
            </header>

            <section className="board-section">
              <header className="board-header">
                <section>
                  <p className="eyebrow">
                    Thirty-day view
                  </p>

                  <h2>{calendarRangeLabel}</h2>

                  <p>
                    Move through the timeline one week
                    at a time.
                  </p>
                </section>

                <section className="calendar-header-actions">
                  <small className="calendar-visible-count">
                    {calendarTasks.length}{" "}
                    {calendarTasks.length === 1
                      ? "task"
                      : "tasks"}{" "}
                    across {calendarTaskGroups.length}{" "}
                    {calendarTaskGroups.length === 1
                      ? "topic"
                      : "topics"}
                  </small>

                  <menu className="calendar-navigation">
                    <li>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => moveCalendar(-7)}
                      >
                        <ChevronLeft
                          size={18}
                          aria-hidden="true"
                        />

                        Previous
                      </button>
                    </li>

                    <li>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={resetCalendarToToday}
                      >
                        Today
                      </button>
                    </li>

                    <li>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => moveCalendar(7)}
                      >
                        Next

                        <ChevronRight
                          size={18}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  </menu>
                </section>
              </header>

              <section
                className="calendar-legend"
                aria-label="Calendar status legend"
              >
                <strong>Legend</strong>

                <ul>
                  <li>
                    <i
                      className="calendar-legend-marker calendar-legend-todo"
                      aria-hidden="true"
                    />
                    To do
                  </li>

                  <li>
                    <i
                      className="calendar-legend-marker calendar-legend-progress"
                      aria-hidden="true"
                    />
                    In progress
                  </li>

                  <li>
                    <i
                      className="calendar-legend-marker calendar-legend-done"
                      aria-hidden="true"
                    />
                    Completed
                  </li>

                  <li>
                    <i
                      className="calendar-legend-marker calendar-legend-overdue"
                      aria-hidden="true"
                    />
                    Overdue
                  </li>
                </ul>
              </section>

              <section
                className="calendar-timeline"
                aria-label="Thirty-day task timeline"
              >
                <header className="calendar-month-row">
                  <strong className="calendar-month-heading">
                    Month
                  </strong>

                  {calendarMonthSegments.map(
                    (segment) => (
                      <strong
                        className="calendar-month-segment"
                        style={{
                          gridColumn: `${
                            segment.startIndex + 2
                          } / span ${segment.dayCount}`,
                        }}
                        key={segment.key}
                      >
                        {segment.label}
                      </strong>
                    ),
                  )}
                </header>

                <header className="calendar-date-row">
                  <strong className="calendar-task-heading">
                    Task
                  </strong>

                  {calendarDays.map((day) => (
                    <time
                      className={`calendar-day-heading ${
                        day.isToday
                          ? "calendar-day-today"
                          : ""
                      } ${
                        day.isWeekend
                          ? "calendar-day-weekend"
                          : ""
                      } ${
                        day.isMonthStart
                          ? "calendar-day-month-start"
                          : ""
                      }`}
                      dateTime={day.isoDate}
                      title={day.fullLabel}
                      key={day.isoDate}
                    >
                      <small>{day.weekday}</small>

                      <strong>
                        {day.dayNumber}
                      </strong>

                      <small>{day.month}</small>
                    </time>
                  ))}
                </header>


                {calendarTasks.length > 0 ? (
                  <ol
                    className="calendar-topic-list"
                    aria-label="Tasks grouped by topic"
                  >
                    {calendarTaskGroups.map((group) => (
                      <li key={group.topic}>
                        <article className="calendar-topic-group">
                          <header className="calendar-topic-header">
                            <section className="calendar-topic-name">
                              <FolderKanban
                                size={17}
                                aria-hidden="true"
                              />

                              <strong>{group.topic}</strong>

                              <small>
                                {group.tasks.length}{" "}
                                {group.tasks.length === 1
                                  ? "task"
                                  : "tasks"}
                              </small>
                            </section>

                            <small className="calendar-topic-summary">
                              Project timeline
                            </small>
                          </header>

                          <ol className="calendar-task-list">
                            {group.tasks.map(
                              ({
                                task,
                                startIndex,
                                endIndex,
                                continuesBefore,
                                continuesAfter,
                              }) => {
                                const taskStartDate =
                                  task.startDate ??
                                  task.dueDate;

                                const overdue =
                                  isTaskOverdue(task);

                                return (
                                  <li key={task.id}>
                                    <article className="calendar-task-row">
                                      <header className="calendar-task-label">
                                        <strong>
                                          {task.title}
                                        </strong>

                                        <small>
                                          {formatDate(
                                            taskStartDate,
                                          )}{" "}
                                          –{" "}
                                          {formatDate(
                                            task.dueDate,
                                          )}
                                        </small>
                                      </header>

                                      {calendarDays.map(
                                        (day, index) => (
                                          <i
                                            className={`calendar-grid-cell ${
                                              day.isToday
                                                ? "calendar-grid-cell-today"
                                                : ""
                                            } ${
                                              day.isWeekend
                                                ? "calendar-grid-cell-weekend"
                                                : ""
                                            } ${
                                              day.isMonthStart
                                                ? "calendar-grid-cell-month-start"
                                                : ""
                                            }`}
                                            style={{
                                              gridColumn:
                                                index + 2,
                                            }}
                                            aria-hidden="true"
                                            key={day.isoDate}
                                          />
                                        ),
                                      )}

                                      <button
                                        className={`calendar-task-bar calendar-task-bar-${task.status} ${
                                          overdue
                                            ? "calendar-task-bar-overdue"
                                            : ""
                                        } ${
                                          continuesBefore
                                            ? "calendar-task-bar-continues-before"
                                            : ""
                                        } ${
                                          continuesAfter
                                            ? "calendar-task-bar-continues-after"
                                            : ""
                                        }`}
                                        style={{
                                          gridColumn: `${
                                            startIndex + 2
                                          } / ${
                                            endIndex + 3
                                          }`,
                                        }}
                                        type="button"
                                        onClick={() =>
                                          openEditTaskModal(
                                            task,
                                          )
                                        }
                                        aria-label={`Edit ${task.title}. Runs from ${taskStartDate} to ${task.dueDate}.`}
                                        title={`${task.title}: ${formatDate(
                                          taskStartDate,
                                        )} to ${formatDate(
                                          task.dueDate,
                                        )}`}
                                      >
                                        <strong>
                                          {task.title}
                                        </strong>

                                        <small>
                                          {formatTaskStatus(
                                            task.status,
                                          )}
                                        </small>
                                      </button>
                                    </article>
                                  </li>
                                );
                              },
                            )}
                          </ol>
                        </article>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <article className="calendar-empty-state">
                    <CalendarDays
                      size={28}
                      aria-hidden="true"
                    />

                    <h3>No tasks in this period</h3>

                    <p>
                      Move to another week or create a
                      task with dates inside this period.
                    </p>

                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => openTaskModal()}
                    >
                      <Plus
                        size={18}
                        aria-hidden="true"
                      />

                      Add a task
                    </button>
                  </article>
                )}
              </section>
            </section>
          </section>
        ) : (
          <section
            className="content-container"
            id="archive"
          >
            <header className="welcome-section">
              <section>
                <p className="eyebrow">
                  Task history
                </p>

                <h1>Archive</h1>

                <p>
                  Review tasks that are no longer part
                  of your active task board.
                </p>
              </section>

              <strong>
                {filteredArchivedTasks.length} archived
                tasks
              </strong>
            </header>

            <section className="board-section">
              <header className="board-header">
                <section>
                  <p className="eyebrow">
                    Archived work
                  </p>

                  <h2>Archived tasks</h2>

                  <p>
                    Tasks are grouped according to
                    their status when they were
                    archived.
                  </p>
                </section>
              </header>

              {isLoadingArchive ? (
                <p role="status" aria-live="polite">
                  Loading archived tasks...
                </p>
              ) : (
                <section
                  className="kanban-board"
                  aria-label="Archived task board"
                >
                  {columns.map((column) => {
                    const columnTasks =
                      filteredArchivedTasks.filter(
                        (task) =>
                          task.status ===
                          column.status,
                      );

                    return (
                      <article
                        className={`task-column column-${column.status}`}
                        key={column.status}
                      >
                        <header className="column-header">
                          <section>
                            <header className="column-title-row">
                              <i
                                className="column-status-dot"
                                aria-hidden="true"
                              />

                              <h3>{column.title}</h3>

                              <small className="column-count">
                                {columnTasks.length}
                              </small>
                            </header>

                            <p>
                              Archived{" "}
                              {column.title.toLowerCase()}{" "}
                              tasks
                            </p>
                          </section>
                        </header>

                        {columnTasks.length > 0 ? (
                          <ol className="task-list">
                            {columnTasks.map((task) => (
                              <li key={task.id}>
                                <ArchivedTaskCard
                                  task={task}
                                  username={username}
                                />
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <article className="empty-column">
                            <Archive
                              size={24}
                              aria-hidden="true"
                            />

                            <p>
                              No archived tasks in this
                              section
                            </p>
                          </article>
                        )}
                      </article>
                    );
                  })}
                </section>
              )}
            </section>
          </section>
        )}
      </section>

      {isModalOpen && (
        <dialog
          className="task-dialog"
          open
          aria-labelledby="task-form-title"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeTaskModal();
            }
          }}
        >
          <article className="task-modal">
            <header className="modal-header">
              <section>
                <p className="eyebrow">
                  Task details
                </p>

                <h2 id="task-form-title">
                  {isEditingTask
                    ? "Edit task"
                    : "Create a new task"}
                </h2>
              </section>

              <button
                className="icon-button"
                type="button"
                onClick={closeTaskModal}
                aria-label="Close task form"
              >
                <X
                  size={20}
                  aria-hidden="true"
                />
              </button>
            </header>

            <form
              className="task-form"
              onSubmit={submitTask}
            >
              <label className="form-field form-field-full">
                Task name

                <input
                  type="text"
                  placeholder="Complete dashboard UI"
                  value={draftTask.title}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      title: event.target.value,
                    }))
                  }
                  required
                  autoFocus
                />
              </label>

              <label className="form-field form-field-full">
                Description

                <textarea
                  placeholder="Describe what needs to be completed"
                  value={draftTask.description}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      description:
                        event.target.value,
                    }))
                  }
                  rows={4}
                  required
                />
              </label>

              <label className="form-field form-field-full">
                Topic

                <input
                  type="text"
                  placeholder="For example: Software Design"
                  value={draftTask.topic}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      topic: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="form-field">
                Status

                <select
                  value={draftTask.status}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      status: event.target
                        .value as TaskStatus,
                    }))
                  }
                >
                  <option value="todo">To do</option>

                  <option value="progress">
                    In progress
                  </option>

                  <option value="done">
                    Completed
                  </option>
                </select>
              </label>

              <label className="form-field">
                Priority

                <select
                  value={draftTask.priority}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      priority: event.target
                        .value as TaskPriority,
                    }))
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="High">High</option>
                </select>
              </label>

              <label className="form-field">
                Start date

                <input
                  type="date"
                  value={draftTask.startDate}
                  max={draftTask.dueDate || undefined}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      startDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="form-field">
                Due date

                <input
                  type="date"
                  value={draftTask.dueDate}
                  min={draftTask.startDate || undefined}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      dueDate: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="form-field">
                Time estimate

                <input
                  type="text"
                  placeholder="For example: 2h"
                  value={draftTask.timeEstimate}
                  onChange={(event) =>
                    setDraftTask((currentTask) => ({
                      ...currentTask,
                      timeEstimate:
                        event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <footer className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeTaskModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  {isEditingTask ? (
                    <Pencil
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus
                      size={18}
                      aria-hidden="true"
                    />
                  )}

                  {isEditingTask
                    ? "Save changes"
                    : "Create task"}
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </main>
  );
}