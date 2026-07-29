import { beforeEach, describe, expect, it } from "vitest";
import {
  getActivitySummary,
  incrementActivitySummary,
  resetActivitySummary,
} from "./activitySummary";

describe("activitySummary", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("devuelve valores iniciales en cero", () => {
    expect(getActivitySummary()).toEqual({
      created: 0,
      completed: 0,
      deleted: 0,
    });
  });

  it("incrementa los contadores al recibir eventos", () => {
    incrementActivitySummary("created");
    incrementActivitySummary("completed");
    incrementActivitySummary("deleted");

    expect(getActivitySummary()).toEqual({
      created: 1,
      completed: 1,
      deleted: 1,
    });
  });

  it("reinicia los contadores correctamente", () => {
    incrementActivitySummary("created");
    incrementActivitySummary("created");

    resetActivitySummary();

    expect(getActivitySummary()).toEqual({
      created: 0,
      completed: 0,
      deleted: 0,
    });
  });
});
