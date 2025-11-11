import React, { Suspense } from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Favourites from "./Favourites";
import type { CharacterItem } from "../../lib/types";

// ========== Mocks ==========

// CSS Modules
vi.mock("./Favourites.module.css", () => ({
  default: {
    container: "container",
    searchWrapper: "searchWrapper",
    search: "search",
    active: "active",
    inactive: "inactive",
    cardsWrapper: "cardsWrapper",
    card: "card",
    listWrapper: "listWrapper",
    show: "show",
    hidden: "hidden",
    buttonWrapper: "buttonWrapper",
    button: "button",
  },
}));

// Constantes
vi.mock("../../const", () => ({
  API: "https://api.test/characters",
}));

// Slices: actions devuelven acciones “planas” para poder asertar dispatch
const addFavoriteMock = vi.fn((payload: CharacterItem) => ({
  type: "favorites/addFavorite",
  payload,
}));
const setSelectedCharacterMock = vi.fn((payload: CharacterItem) => ({
  type: "selected/set",
  payload,
}));
const showListMock = vi.fn(() => ({ type: "showList/toggle" }));
const setFilterTextMock = vi.fn((payload: string) => ({
  type: "filter/setText",
  payload,
}));

vi.mock("../../lib/features/favorites/favoritesSlice", () => ({
  addFavorite: (p: CharacterItem) => addFavoriteMock(p),
}));
vi.mock("../../lib/features/selected/selectedSlice", () => ({
  setSelectedCharacter: (p: CharacterItem) => setSelectedCharacterMock(p),
}));
vi.mock("../../lib/features/showList/showListSlice", () => ({
  showList: () => showListMock(),
}));
vi.mock("../../lib/features/filter/filter", () => ({
  setFilterText: (p: string) => setFilterTextMock(p),
}));

// react-redux: controlamos selectores y dispatch
const useSelectorMock = vi.fn();
const dispatchMock = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useSelector: (fn: (state: unknown) => unknown) => useSelectorMock(fn),
    useDispatch: () => dispatchMock,
  };
});

// Lazy components: Card, User, FavouriteList, Search
vi.mock("../Card/Card", () => ({
  __esModule: true,
  default: (props: {
    name: string;
    onClick: () => void;
    onClickSelect?: (item: CharacterItem) => void;
  }) => {
    const mockCharacter: CharacterItem = {
      id: 1,
      name: props.name,
      status: "Alive" as const,
      species: "Human",
      type: "",
      gender: "Male",
      origin: { name: "Earth", url: "" },
      location: { name: "Earth", url: "" },
      image: "",
      episode: [],
      url: "",
      created: "",
      isAlive: true,
      isFavorite: false,
    };

    return (
      <div data-testid={`card-${props.name}`}>
        <p>{props.name}</p>
        <button
          data-testid={`card-toggle-${props.name}`}
          onClick={props.onClick}
        >
          toggle
        </button>
        <button
          data-testid={`card-select-${props.name}`}
          onClick={() =>
            props.onClickSelect && props.onClickSelect(mockCharacter)
          }
        >
          select
        </button>
      </div>
    );
  },
}));
vi.mock("../Icons/User/User", () => ({
  __esModule: true,
  default: () => <span data-testid="icon-user">user</span>,
}));
vi.mock("../FavouriteList/FavouriteList", () => ({
  __esModule: true,
  default: ({ show }: { show: boolean }) => (
    <div data-testid="fav-list">show:{String(show)}</div>
  ),
}));
vi.mock("../Icons/Search/Search", () => ({
  __esModule: true,
  default: () => <span data-testid="icon-search">search</span>,
}));

// fetch global para PATCH API Calls
const fetchMock = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  // @ts-expect-error override global
  global.fetch = fetchMock;
});

// Helper para inyectar estado de Redux en useSelector
function setReduxState({
  favorites = [],
  text = "",
  show = false,
}: {
  favorites?: CharacterItem[];
  text?: string;
  show?: boolean;
}) {
  useSelectorMock.mockImplementation((selectorFn: (state: unknown) => unknown) =>
    selectorFn({
      favorites: { favorites },
      filter: { text },
      showList: { show },
    })
  );
}

// ========== Tests ==========

describe("Favourites", () => {
  it("renderiza input de búsqueda, botón FAVS y la lista con show/hidden", async () => {
    setReduxState({
      favorites: [],
      text: "",
      show: false,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={[]} />
      </Suspense>
    );

    // Input y placeholder
    const input = await screen.findByPlaceholderText(/find your character/i);
    expect(input).toBeInTheDocument();

    // Botón FAVS
    const favsBtn = screen.getByRole("button", { name: /favs/i });
    expect(favsBtn).toBeInTheDocument();

    // FavouriteList recibe show=false
    expect(screen.getByTestId("fav-list")).toHaveTextContent("show:false");
  });

  it("aplica clase activa en el contenedor de búsqueda cuando hay texto (filter.text)", async () => {
    setReduxState({
      favorites: [],
      text: "mor",
      show: false,
    });

    const { container } = render(
      <Suspense fallback="loading">
        <Favourites data={[]} />
      </Suspense>
    );

    // contenedor de búsqueda (primer .search que monta el componente)
    const searchDiv = container.querySelector(".search") as HTMLElement;
    expect(searchDiv.className).toContain("active");
    expect(searchDiv.className).not.toContain("inactive");
  });

  it("filtra favoritos por texto y renderiza Cards correspondientes", async () => {
    const items: CharacterItem[] = [
      {
        id: 1,
        name: "Rick Sanchez",
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
      },
      {
        id: 2,
        name: "Morty Smith",
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
        isFavorite: true,
      },
      {
        id: 3,
        name: "Summer Smith",
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Female",
        origin: {
          name: "Earth (Replacement Dimension)",
          url: "https://rickandmortyapi.com/api/location/20",
        },
        location: {
          name: "Earth (Replacement Dimension)",
          url: "https://rickandmortyapi.com/api/location/20",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
        episode: ["https://rickandmortyapi.com/api/episode/6"],
        url: "https://rickandmortyapi.com/api/character/3",
        created: "2017-11-04T19:09:56.428Z",
        isAlive: true,
        isFavorite: true,
      },
    ];

    // texto = "mo" -> solo Rick
    setReduxState({
      favorites: items,
      text: "ri",
      show: false,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={items} />
      </Suspense>
    );

    // Debe mostrarse solo Rick
    expect(screen.queryByTestId("card-Morty")).not.toBeInTheDocument();
    expect(await screen.findByTestId("card-Rick")).toBeInTheDocument();
    expect(screen.queryByTestId("card-Summer")).not.toBeInTheDocument();
  });

  it("al escribir en el input despacha setFilterText con el valor", async () => {
    setReduxState({
      favorites: [],
      text: "",
      show: false,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={[]} />
      </Suspense>
    );

    const input = await screen.findByPlaceholderText(/find your character/i);
    fireEvent.change(input, { target: { value: "bird" } });

    expect(setFilterTextMock).toHaveBeenCalledTimes(1);
    expect(setFilterTextMock).toHaveBeenCalledWith("bird");
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "filter/setText",
      payload: "bird",
    });
  });

  it("click en FAVS despacha showList()", async () => {
    setReduxState({
      favorites: [],
      text: "",
      show: false,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={[]} />
      </Suspense>
    );

    fireEvent.click(screen.getByRole("button", { name: /favs/i }));

    expect(showListMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "showList/toggle" });
  });

  it("click en 'toggle' del Card hace PATCH y luego despacha addFavorite(item)", async () => {
    const item: CharacterItem = {
      id: 7,
      name: "Summer Smith",
      status: "Alive" as const,
      species: "Human",
      type: "",
      gender: "Female",
      origin: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      location: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/6"],
      url: "https://rickandmortyapi.com/api/character/3",
      created: "2017-11-04T19:09:56.428Z",
      isAlive: true,
      isFavorite: true,
    };

    setReduxState({
      favorites: [item],
      text: "",
      show: false,
    });

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

    render(
      <Suspense fallback="loading">
        <Favourites data={[item]} />
      </Suspense>
    );

    const toggleBtn = await screen.findByTestId("card-toggle-Summer Smith");
    fireEvent.click(toggleBtn);

    // Se hace PATCH a `${API}/${id}` con el inverso de isFavorite
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://api.test/characters/${item.id}`);
    expect(init).toMatchObject({
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    const body = JSON.parse((init as RequestInit & { body: string }).body);
    expect(body).toEqual({ isFavorite: !item.isFavorite });

    // Luego despacha addFavorite con el item original
    expect(addFavoriteMock).toHaveBeenCalledTimes(1);
    expect(addFavoriteMock).toHaveBeenCalledWith(expect.objectContaining(item));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "favorites/addFavorite",
      payload: expect.objectContaining(item),
    });
  });

  it("click en 'select' del Card despacha setSelectedCharacter(item)", async () => {
    const item: CharacterItem = {
      id: 3,
      name: "Summer Smith",
      status: "Alive" as const,
      species: "Human",
      type: "",
      gender: "Female",
      origin: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      location: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/6"],
      url: "https://rickandmortyapi.com/api/character/3",
      created: "2017-11-04T19:09:56.428Z",
      isAlive: true,
      isFavorite: true,
    };

    setReduxState({
      favorites: [item],
      text: "",
      show: false,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={[item]} />
      </Suspense>
    );

    const selectBtn = await screen.findByTestId("card-select-Summer Smith");
    fireEvent.click(selectBtn);

    expect(setSelectedCharacterMock).toHaveBeenCalledTimes(1);
    expect(setSelectedCharacterMock).toHaveBeenCalledWith(
      expect.objectContaining(item)
    );
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "selected/set",
      payload: expect.objectContaining(item),
    });
  });

  it("FavouriteList recibe show=true cuando el estado lo indica", async () => {
    setReduxState({
      favorites: [],
      text: "",
      show: true,
    });

    render(
      <Suspense fallback="loading">
        <Favourites data={[]} />
      </Suspense>
    );

    expect(await screen.findByTestId("fav-list")).toHaveTextContent(
      "show:true"
    );
  });
});
