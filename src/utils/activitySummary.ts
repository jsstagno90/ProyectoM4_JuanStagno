const STORAGE_KEY = "task-activity-summary";

export interface ActivitySummary {
  created: number;
  completed: number;
  deleted: number;
}

const defaultSummary: ActivitySummary = {
  created: 0,
  completed: 0,
  deleted: 0,
};

function readSummary(): ActivitySummary {
  if (typeof window === "undefined") {
    return { ...defaultSummary };
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return { ...defaultSummary };
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<ActivitySummary>;

    return {
      created: Number(parsedValue.created ?? 0),
      completed: Number(parsedValue.completed ?? 0),
      deleted: Number(parsedValue.deleted ?? 0),
    };
  } catch {
    return { ...defaultSummary };
  }
}

function writeSummary(summary: ActivitySummary) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
}

export function getActivitySummary(): ActivitySummary {
  return readSummary();
}

export function incrementActivitySummary(type: keyof ActivitySummary) {
  const summary = readSummary();
  const nextSummary = {
    ...summary,
    [type]: summary[type] + 1,
  };

  writeSummary(nextSummary);
}

export function resetActivitySummary() {
  writeSummary({ ...defaultSummary });
}
