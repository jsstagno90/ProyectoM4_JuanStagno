import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TaskItem from "./TaskItem";
import userEvent from "@testing-library/user-event";
import { Timestamp } from "firebase/firestore";

const task = {
  id: "1",
  userId: "user1",
  title: "Aprender Testing",
  description: "Practicar con Vitest",
  completed: false,
   createdAt: Timestamp.fromDate(new Date()),

};

describe("TaskItem", () => {
  it("renderiza correctamente una tarea", () => {
    render(
      <TaskItem
        task={task}
        onDelete={vi.fn()}
        onToggleCompleted={vi.fn()}
        onUpdate={vi.fn()}
      />
    );

    expect(screen.getByText("Aprender Testing")).toBeInTheDocument();
    expect(screen.getByText("Practicar con Vitest")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });
});


it("llama a onToggleCompleted al hacer clic en Completar", async () => {
  const user = userEvent.setup();

  const onToggleCompleted = vi.fn();

  render(
    <TaskItem
      task={task}
      onDelete={vi.fn()}
      onToggleCompleted={onToggleCompleted}
      onUpdate={vi.fn()}
    />
  );

  await user.click(
    screen.getByRole("button", { name: /completar/i })
  );

  expect(onToggleCompleted).toHaveBeenCalledWith("1", false);
});

it("permite editar una tarea y guardarla", async () => {
  const user = userEvent.setup();

  const onUpdate = vi.fn();

  render(
    <TaskItem
      task={task}
      onDelete={vi.fn()}
      onToggleCompleted={vi.fn()}
      onUpdate={onUpdate}
    />
  );

  // Entrar en modo edición
  await user.click(
    screen.getByRole("button", { name: /editar/i })
  );

  // Buscar los campos
  const titleInput = screen.getByDisplayValue("Aprender Testing");
  const descriptionInput = screen.getByDisplayValue(
    "Practicar con Vitest"
  );

  // Cambiar el contenido
  await user.clear(titleInput);
  await user.type(titleInput, "Testing avanzado");

  await user.clear(descriptionInput);
  await user.type(descriptionInput, "Editar una tarea");

  // Guardar
  await user.click(
    screen.getByRole("button", { name: /guardar/i })
  );

  expect(onUpdate).toHaveBeenCalledWith(
    "1",
    "Testing avanzado",
    "Editar una tarea"
  );
});