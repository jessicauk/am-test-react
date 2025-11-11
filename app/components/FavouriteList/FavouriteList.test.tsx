// app/components/FavouriteList/FavouriteList.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FavouriteList from "./FavouriteList";

// --- Mocks ---

// Mock de CSS Modules para no depender de hashes
vi.mock("./FavouriteList.module.css", () => ({
  default: {
    list: "list",
    show: "show",
    hidden: "hidden",
    listItem: "listItem",
    empty: "empty",
  },
}));

// Mock del icono Trash, exponiendo onClick
vi.mock("../Icons/Trash/Trash", () => ({
  __esModule: true,
  default: (props: any) => (
    <button data-testid="trash" onClick={props.onClick}>
      trash
    </button>
  ),
}));

// Mock del action creator addFavorite
interface FavoriteItem {
  id: number;
  name: string;
  image: string;
  isFavorite: boolean;
}

const addFavoriteMock = vi.fn((payload: FavoriteItem) => ({
  type: "favorites/addFavorite",
  payload,
}));
vi.mock("@/app/lib/features/favorites/favoritesSlice", () => ({
  addFavorite: (p: FavoriteItem) => addFavoriteMock(p),
}));

// Mock de react-redux: controlamos useSelector / useDispatch
const useSelectorMock = vi.fn();
const dispatchMock = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useSelector: (fn: any) => useSelectorMock(fn),
    useDispatch: () => dispatchMock,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

// Helper para setear el estado que devolverá useSelector
function setFavoritesState(favorites: FavoriteItem[]) {
  useSelectorMock.mockImplementation((selectorFn: (state: { favorites: { favorites: FavoriteItem[] } }) => FavoriteItem[]) =>
    selectorFn({
      favorites: { favorites },
    })
  );
}

describe("FavouriteList", () => {
  it("muestra hasta 4 ítems favoritos cuando show=true", () => {
    // 5 elementos, solo 4 deben renderizarse
    const items = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      name: `Char-${i + 1}`,
      image: `/img${i + 1}.png`,
      isFavorite: true,
    }));
    setFavoritesState(items);

    const { container } = render(<FavouriteList show={true} />);

    // Tiene clases list + show
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("list");
    expect(root.className).toContain("show");
    expect(root.className).not.toContain("hidden");

    // Solo 4 visibles
    expect(screen.getAllByText(/Char-/i)).toHaveLength(4);
    expect(screen.queryByText("Char-5")).not.toBeInTheDocument();

    // No debe mostrar el mensaje vacío
    expect(
      screen.queryByText(/No favorite characters added\./i)
    ).not.toBeInTheDocument();
  });

  it("aplica clase hidden cuando show=false", () => {
    setFavoritesState([
      { id: 1, name: "Morty", image: "/morty.png", isFavorite: true },
    ]);

    const { container } = render(<FavouriteList show={false} />);

    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("list");
    expect(root.className).toContain("hidden");
    expect(root.className).not.toContain("show");
  });

  it("muestra mensaje vacío cuando no hay favoritos marcados", () => {
    // Lista con elementos pero ninguno isFavorite=true
    setFavoritesState([
      { id: 1, name: "Rick", image: "/r.png", isFavorite: false },
      { id: 2, name: "Morty", image: "/m.png", isFavorite: false },
    ]);

    render(<FavouriteList show={true} />);

    expect(
      screen.getByText(/No favorite characters added\./i)
    ).toBeInTheDocument();
  });

  it("al hacer click en Trash, despacha addFavorite con el item", () => {
    const fav = {
      id: 7,
      name: "Birdperson",
      image: "/bird.png",
      isFavorite: true,
    };
    setFavoritesState([fav]);

    render(<FavouriteList show={true} />);

    // Hay un botón trash por ítem
    const trashBtn = screen.getByTestId("trash");
    fireEvent.click(trashBtn);

    // Verifica que addFavorite fue llamado y dispatchado con el item
    expect(addFavoriteMock).toHaveBeenCalledTimes(1);
    expect(addFavoriteMock).toHaveBeenCalledWith(expect.objectContaining(fav));

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "favorites/addFavorite",
        payload: expect.objectContaining(fav),
      })
    );
  });
});