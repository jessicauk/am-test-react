import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";
import type { CharacterItem } from "../../lib/types";

const baseCharacter: CharacterItem = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth", url: "" },
  location: { name: "Earth", url: "" },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [],
  url: "",
  created: "",
  isFavorite: false,
};

describe("Card component", () => {
  it("should render name, image and Like text", () => {
    render(<Card {...baseCharacter} />);
    
    // Usamos una función para evitar errores con contenido dividido
    expect(
      screen.getByText((content) => content.includes("Rick Sanchez"))
    ).toBeInTheDocument();

    expect(screen.getByText("Like")).toBeInTheDocument();
    
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Rick Sanchez");
  });

  it("should call onClick when heart is clicked", () => {
    const mockClick = vi.fn();
    render(<Card {...baseCharacter} onClick={mockClick} />);

    fireEvent.click(screen.getByText("Like"));
    expect(mockClick).toHaveBeenCalled();
  });

  it("should call onClickSelect when image is clicked", () => {
    const mockSelect = vi.fn();
    render(<Card {...baseCharacter} onClickSelect={mockSelect} />);

    const img = screen.getByRole("img");
    fireEvent.click(img);
    expect(mockSelect).toHaveBeenCalled();
  });

  it("should apply activeCard class when isFavorite is true", () => {
    render(<Card {...baseCharacter} isFavorite={true} />);
    const cardElement = screen.getByText((c) => c.includes("Rick Sanchez")).closest("div");
    expect(cardElement?.className).toMatch(/activeCard/);
  });
});
