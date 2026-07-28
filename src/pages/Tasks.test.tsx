import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Tasks from "./Tasks";
import { useTasks } from "../hooks/useTasks";

vi.mock("../hooks/useTasks", () => ({
  useTasks: vi.fn(),
}));

const mockedUseTasks = vi.mocked(useTasks);

describe("Tasks", () => {
  beforeEach(() => {
    mockedUseTasks.mockReset();
  });

  it("prioriza los resultados que coinciden con la búsqueda", async () => {
    const user = userEvent.setup();

    mockedUseTasks.mockReturnValue({
      tasks: [
        {
          id: "1",
          userId: "user1",
          title: "Otra tarea",
          description: "Esto es un estudio de caso",
          completed: false,
          createdAt: Timestamp.fromDate(new Date("2024-01-01T00:00:00.000Z")),
        },
        {
          id: "2",
          userId: "user1",
          title: "Estudiar React",
          description: "Aprender componentes",
          completed: false,
          createdAt: Timestamp.fromDate(new Date("2024-01-02T00:00:00.000Z")),
        },
      ],
      loading: false,
      error: null,
      createTask: vi.fn(),
      deleteTask: vi.fn(),
      toggleTaskCompleted: vi.fn(),
      updateTask: vi.fn(),
      refreshTasks: vi.fn(),
    });

    render(<Tasks />);

    await user.type(screen.getByPlaceholderText(/buscar por título o descripción/i), "est");

    const renderedTitles = screen
      .getAllByRole("heading", { level: 3 })
      .map((element) => element.textContent);

    expect(renderedTitles[0]).toBe("Estudiar React");
  });
});
