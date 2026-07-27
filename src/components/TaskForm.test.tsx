import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("envía una nueva tarea", async () => {
    const user = userEvent.setup();

    const onCreateTask = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onCreateTask={onCreateTask} />);

    await user.type(
      screen.getByPlaceholderText("Ej: Estudiar React"),
      "Aprender Vitest"
    );

    await user.type(
      screen.getByPlaceholderText("Describe la tarea..."),
      "Escribir los primeros tests"
    );

    await user.click(
      screen.getByRole("button", {
        name: /crear tarea/i,
      })
    );

    expect(onCreateTask).toHaveBeenCalledTimes(1);

    expect(onCreateTask).toHaveBeenCalledWith({
      title: "Aprender Vitest",
      description: "Escribir los primeros tests",
    });
  });

  it("muestra un error si el título está vacío", async () => {
    const user = userEvent.setup();

    const onCreateTask = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onCreateTask={onCreateTask} />);

    await user.click(
      screen.getByRole("button", {
        name: /crear tarea/i,
      })
    );

    expect(
      screen.getByText("Por favor introduzca un título")
    ).toBeInTheDocument();

    expect(onCreateTask).not.toHaveBeenCalled();
  });

  it("limpia los campos después de crear una tarea", async () => {
    const user = userEvent.setup();

    const onCreateTask = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onCreateTask={onCreateTask} />);

    const titleInput = screen.getByPlaceholderText(
      "Ej: Estudiar React"
    );

    const descriptionInput = screen.getByPlaceholderText(
      "Describe la tarea..."
    );

    await user.type(titleInput, "Nueva tarea");
    await user.type(descriptionInput, "Descripción");

    await user.click(
      screen.getByRole("button", {
        name: /crear tarea/i,
      })
    );

    expect(onCreateTask).toHaveBeenCalledTimes(1);

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
  });
});