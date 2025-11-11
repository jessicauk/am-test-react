import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock de localStorage en memoria
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
  const mod = await import("./showListSlice");
  return {
    reducer: mod.default,
    showList: mod.showList,
  };
}

describe("showListSlice", () => {
  it("estado inicial: show === false", async () => {
    const { reducer } = await importSlice();
    const state = reducer(undefined as any, { type: "@@INIT" });
    expect(state.show).toBe(false);
  });

  it("showList alterna (false -> true) y persiste en localStorage", async () => {
    const { reducer, showList } = await importSlice();

    const s0 = reducer(undefined as any, { type: "@@INIT" });
    expect(s0.show).toBe(false);

    const s1 = reducer(s0, showList());
    expect(s1.show).toBe(true);
    expect(localStorage.getItem("show")).toBe(JSON.stringify(true));
  });

  it("showList alterna nuevamente (true -> false) y actualiza localStorage", async () => {
    const { reducer, showList } = await importSlice();

    const s0 = reducer(undefined as any, { type: "@@INIT" });
    const s1 = reducer(s0, showList());
    expect(s1.show).toBe(true);

    const s2 = reducer(s1, showList());
    expect(s2.show).toBe(false);
    expect(localStorage.getItem("show")).toBe(JSON.stringify(false));
  });

  it("un valor previo en localStorage no afecta el estado inicial (no se lee en init)", async () => {
    localStorage.setItem("show", JSON.stringify(true));
    const { reducer } = await importSlice();

    const state = reducer(undefined as any, { type: "@@INIT" });
    // El slice no lee localStorage al iniciar, por diseño
    expect(state.show).toBe(false);
  });
});
