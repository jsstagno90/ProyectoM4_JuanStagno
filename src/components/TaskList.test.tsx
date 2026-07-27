import { render, screen } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import { describe, expect, it, vi } from "vitest";

import TaskList from "./TaskList";

const tasks = [
  {
    id: "1",
    userId: "user1",
    title: "React",
    description: "Aprender React",
    completed: false,
    createdAt: Timestamp.fromDate(new Date()),
  },
  {
    id: "2",
    userId: "user1",
    title: "Testing",
    description: "Aprender Vitest",
    completed: true,
    createdAt: Timestamp.fromDate(new Date()),
  },
];

describe("TaskList", () => {
  it("muestra un mensaje cuando no hay tareas", () => {
    render(
      <TaskList
        tasks={[]}
        onDelete={vi.fn()}
        onToggleCompleted={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(
      screen.getByText("No hay tareas creadas.")
    ).toBeInTheDocument();
  });

  it("renderiza todas las tareas", () => {
    render(
      <TaskList
        tasks={tasks}
        onDelete={vi.fn()}
        onToggleCompleted={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();

    expect(screen.getByText("Aprender React")).toBeInTheDocument();
    expect(screen.getByText("Aprender Vitest")).toBeInTheDocument();
  });
});