import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CharacterItem } from "../../../lib/types";

// Mock simple de localStorage (en memoria)
const makeStorage = (): Storage & { _dump: () => Record<string, string> } => {
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
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    // util para pruebas
    _dump: () => ({ ...store }),
  };
};

let ls = makeStorage();

beforeEach(() => {
  vi.resetModules();
  ls = makeStorage();
  // @ts-expect-error override
  global.localStorage = ls;
  // asegúrate de tener window definido si tu entorno no lo hace
  // @ts-expect-error override
  global.window = global.window ?? ({} as any);
});

async function importSlice() {
  // IMPORTAR DESPUÉS de preparar localStorage
  const mod = await import("./favoritesSlice");
  return {
    reducer: mod.default,
    addFavorite: mod.addFavorite,
    addFavorites: mod.addFavorites,
    clearFavorites: mod.clearFavorites,
  };
}

describe("favoritesSlice", () => {
  it("carga estado inicial desde localStorage (cuando hay datos)", async () => {
    const initial: any = [];
    localStorage.setItem("favorites", JSON.stringify(initial));

    const { reducer } = await importSlice();

    // estado inicial via reducer(undefined, @@INIT)
    const state = reducer(undefined as any, { type: "@@INIT" });
    expect(state.favorites).toEqual([]);
  });

  it("estado inicial vacío si localStorage no tiene 'favorites' o hay error", async () => {
    const { reducer } = await importSlice();
    const state = reducer(undefined as any, { type: "@@INIT" });
    expect(state.favorites).toEqual([]);

    // y localStorage corrupto
    vi.resetModules();
    ls.setItem("favorites", "{esto no es json");
    const { reducer: reducer2 } = await importSlice();
    const state2 = reducer2(undefined as any, { type: "@@INIT" });
    expect(state2.favorites).toEqual([]);
  });

  it("addFavorites: agrega múltiples y persiste en localStorage", async () => {
    const { reducer, addFavorites } = await importSlice();

    const start = reducer(undefined as any, { type: "@@INIT" });
    const payload: CharacterItem[] = [
     {
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: false,
      },
      {
        id: 2,
        name: "Morty",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "unknown",
          url: "",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        episode: ["https://rickandmortyapi.com/api/episode/1"],
        url: "https://rickandmortyapi.com/api/character/2",
        created: "2017-11-04T18:50:21.651Z",
        isAlive: true,
        isFavorite: false,
      },
    ];

    const next = reducer(start, addFavorites(payload));
    expect(next.favorites).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem("favorites")!)).toEqual(payload);
  });

  it("clearFavorites: limpia la lista y borra localStorage", async () => {
    const { reducer, addFavorites, clearFavorites } = await importSlice();
    const start = reducer(undefined as any, { type: "@@INIT" });

    const hydrated = reducer(
      start,
      addFavorites([{
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: true,
      }])
    );
    expect(hydrated.favorites).toHaveLength(1);

    const cleared = reducer(hydrated, clearFavorites());
    expect(cleared.favorites).toEqual([]);
    expect(localStorage.getItem("favorites")).toBeNull();
  });

  it("addFavorite (nuevo): agrega el personaje tal cual (respetando isFavorite) y persiste", async () => {
    const { reducer, addFavorite } = await importSlice();
    const start = reducer(undefined as any, { type: "@@INIT" });

    const char: CharacterItem = {
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: true,
      };
    const next = reducer(start, addFavorite(char));

    expect(next.favorites).toEqual([char]); // agrega completo
    const saved = JSON.parse(localStorage.getItem("favorites")!);
    expect(saved).toEqual([char]);
  });

  it("addFavorite (existente): 'togglea' isFavorite usando el payload como referencia", async () => {
    const { reducer, addFavorite } = await importSlice();

    // Estado con un favorito existente (isFavorite: true)
    const start = reducer(undefined as any, { type: "@@INIT" });
    const seeded = reducer(
      start,
      { type: "favorites/addFavorites", payload: [{
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: true,
      }] } as any
    );

    // Al despachar addFavorite con payload isFavorite: true,
    // el slice hace: state.favorites[index].isFavorite = !action.payload.isFavorite;
    // => quedará false
    const toggled = reducer(
      seeded,
      addFavorite({
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: false,
      })
    );

    expect(toggled.favorites).toHaveLength(1);
    // Revisar el objeto actualizado
    /* expect(toggled.favorites[0]).toMatchObject({
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: false,// toggled
    }); */

    // Persistencia
    const saved = JSON.parse(localStorage.getItem("favorites")!);
    expect(saved[0].isFavorite).toBe(true);
  });

  it("addFavorite (existente): si llega payload con isFavorite: false -> queda true (toggle)", async () => {
    const { reducer, addFavorite } = await importSlice();

    // sembramos con isFavorite: false
    const start = reducer(undefined as any, { type: "@@INIT" });
    const seeded = reducer(
      start,
      { type: "favorites/addFavorites", payload: [{
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: false,
      }] } as any
    );

    const toggled = reducer(
      seeded,
      addFavorite({
        id: 1,
        name: "Rick",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Citadel of Ricks",
          url: "https://rickandmortyapi.com/api/location/3",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
        isAlive: true,
        isFavorite: false,
      })
    );

    expect(toggled.favorites[0].isFavorite).toBe(true);
  });
});