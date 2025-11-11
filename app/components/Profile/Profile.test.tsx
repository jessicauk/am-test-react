import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Profile from "./Profile";

// ---- Mocks ----

// CSS Modules
vi.mock("./Profile.module.css", () => ({
  default: {
    image: "image",
    information: "information",
  },
}));

// next/image -> passthrough a <img> para poder consultar por role/src
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock react-redux (useSelector)
const useSelectorMock = vi.fn();
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("react-redux");
  return {
    ...actual,
    useSelector: (fn: (state: unknown) => unknown) => useSelectorMock(fn),
  };
});

// Los lazy imports:
// ../Item/Item.module
vi.mock("../Item/Item.module", () => ({
  __esModule: true,
  default: ({ title, value, info }: { title: string; value: string | number; info?: string }) => (
    <p data-testid="mock-item">
      <span data-testid="item-title">{title}</span>
      <span data-testid="item-value">{String(value ?? "")}</span>
      <span data-testid="item-info">{String(info ?? "")}</span>
    </p>
  ),
}));

// ../ListItem/ListItem
vi.mock("../ListItem/ListItem", () => ({
  __esModule: true,
  default: ({ data }: { data: Array<{ title: string; value: string | number; info?: string }> }) => (
    <div data-testid="mock-list">
      {data.map((d, i) => (
        <p key={i} data-testid={`list-row-${i}`}>
          <b>{d.title}</b>: <span>{String(d.value)}</span>
        </p>
      ))}
    </div>
  ),
}));

// ../Status/Status
vi.mock("../Status/Status", () => ({
  __esModule: true,
  default: ({ isAlive }: { isAlive: boolean }) => (
    <div data-testid="mock-status">{String(isAlive)}</div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// Helper para setear el estado que consultará useSelector
function setSelectedCharacterState(character: unknown) {
  useSelectorMock.mockImplementation((selectorFn: (state: unknown) => unknown) =>
    selectorFn({
      selected: { character },
    })
  );
}

describe("Profile", () => {
  it("renderiza datos del personaje seleccionado (imagen, Status, Item y ListItem)", async () => {
    const selected = {
      id: 1,
      name: "Rick Sanchez",
      species: "Human",
      image: "/rick.png",
      isAlive: true,
      gender: "Male",
      origin: { name: "Earth (C-137)" },
      location: { name: "Citadel of Ricks" },
      episode: ["E1", "E2", "E3"],
    };
    setSelectedCharacterState(selected);

    render(
      <Suspense fallback="loading">
        <Profile />
      </Suspense>
    );

    // Imagen de perfil del personaje
    const img = await screen.findByRole("img", { name: /profile image/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/rick.png");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "800");

    // Status recibe isAlive=true
    expect(screen.getByTestId("mock-status")).toHaveTextContent("true");

    // Item (title=name, value=species, info="")
    expect(screen.getByTestId("item-title")).toHaveTextContent("Rick Sanchez");
    expect(screen.getByTestId("item-value")).toHaveTextContent("Human");
    expect(screen.getByTestId("item-info")).toHaveTextContent("");

    // ListItem recibe lista calculada (Origin, Location, Gender, Episode length)
    expect(screen.getByTestId("list-row-0")).toHaveTextContent("Origin");
    expect(screen.getByTestId("list-row-0")).toHaveTextContent("Earth (C-137)");

    expect(screen.getByTestId("list-row-1")).toHaveTextContent("Location");
    expect(screen.getByTestId("list-row-1")).toHaveTextContent("Citadel of Ricks");

    expect(screen.getByTestId("list-row-2")).toHaveTextContent("Gender");
    expect(screen.getByTestId("list-row-2")).toHaveTextContent("Male");

    expect(screen.getByTestId("list-row-3")).toHaveTextContent("Episode");
    expect(screen.getByTestId("list-row-3")).toHaveTextContent("3");
  });

  it("cuando no hay personaje seleccionado, usa fondo por defecto y valores Unknown/0", async () => {
    setSelectedCharacterState(null);

    render(
      <Suspense fallback="loading">
        <Profile />
      </Suspense>
    );

    // Imagen por defecto
    const img = await screen.findByRole("img", { name: /profile image/i });
    expect(img).toHaveAttribute("src", "/background.jpg");

    // Status false
    expect(screen.getByTestId("mock-status")).toHaveTextContent("false");

    // Item: title "", value 0, info ""
    expect(screen.getByTestId("item-title")).toHaveTextContent("");
    expect(screen.getByTestId("item-value")).toHaveTextContent("0");
    expect(screen.getByTestId("item-info")).toHaveTextContent("");

    // ListItem: Unknown/Unknown/Unknown/0
    expect(screen.getByTestId("list-row-0")).toHaveTextContent("Origin");
    expect(screen.getByTestId("list-row-0")).toHaveTextContent("Unknown");

    expect(screen.getByTestId("list-row-1")).toHaveTextContent("Location");
    expect(screen.getByTestId("list-row-1")).toHaveTextContent("Unknown");

    expect(screen.getByTestId("list-row-2")).toHaveTextContent("Gender");
    expect(screen.getByTestId("list-row-2")).toHaveTextContent("Unknown");

    expect(screen.getByTestId("list-row-3")).toHaveTextContent("Episode");
    expect(screen.getByTestId("list-row-3")).toHaveTextContent("0");
  });
});