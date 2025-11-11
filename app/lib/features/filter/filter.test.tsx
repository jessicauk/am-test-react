import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock simple de localStorage en memoria
const makeStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
    _dump: () => ({ ...store }),
  };
};

let ls = makeStorage();

beforeEach(() => {
  vi.resetModules();
  ls = makeStorage();
  // @ts-expect-error override
  global.localStorage = ls as any;
});

async function importSlice() {
  const mod = await import("./filter"); // <-- ajusta la ruta si difiere
  return {
    reducer: mod.default,
    setFilterText: mod.setFilterText,
  };
}

describe("filter slice", () => {
  it("estado inicial: text === ''", async () => {
    const { reducer } = await importSlice();
    const state = reducer(undefined as any, { type: "@@INIT" });
    expect(state.text).toBe("");
  });

  it("setFilterText actualiza el estado y persiste en localStorage", async () => {
    const { reducer, setFilterText } = await importSlice();

    const start = reducer(undefined as any, { type: "@@INIT" });
    const next = reducer(start, setFilterText("morty"));

    expect(next.text).toBe("morty");
    expect(localStorage.getItem("filter")).toBe(JSON.stringify("morty"));
  });

  it("setFilterText sobrescribe el valor previo y reescribe localStorage", async () => {
    const { reducer, setFilterText } = await importSlice();

    let state = reducer(undefined as any, { type: "@@INIT" });
    state = reducer(state, setFilterText("rick"));
    expect(state.text).toBe("rick");
    expect(localStorage.getItem("filter")).toBe(JSON.stringify("rick"));

    state = reducer(state, setFilterText("summer"));
    expect(state.text).toBe("summer");
    expect(localStorage.getItem("filter")).toBe(JSON.stringify("summer"));
  });
});
