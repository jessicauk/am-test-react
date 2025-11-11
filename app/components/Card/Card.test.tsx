import "@testing-library/jest-dom";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import Card from "./Card";
import type { CharacterItem } from "../../lib/types";

// Mock del componente Heart
vi.mock("../Icons/Heart/Heart", () => ({
  default: ({ className }: { className: string }) => <div data-testid="heart-icon" className={className}>❤</div>,
}));

const baseCharacter: CharacterItem = {
  id: 1,
  name: "Rick Sanchez",
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  isFavorite: false,
  isAlive: true,
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth", url: "" },
  location: { name: "Earth", url: "" },
  episode: [],
  url: "",
  created: "",
};

describe("Card component", () => {
  it("should render name, image and Like text", () => {
    render(<Card {...baseCharacter} />);
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByAltText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  it("should call onClick when like is clicked", () => {
    const onClick = vi.fn();
    render(<Card {...baseCharacter} onClick={onClick} />);
    fireEvent.click(screen.getByText("Like"));
    expect(onClick).toHaveBeenCalledWith(baseCharacter);
  });

  it("should call onClickSelect when image is clicked", () => {
    const onClickSelect = vi.fn();
    render(<Card {...baseCharacter} onClickSelect={onClickSelect} />);
    fireEvent.click(screen.getByAltText("Rick Sanchez"));
    expect(onClickSelect).toHaveBeenCalledWith(baseCharacter);
  });

  it("should add active class if isFavorite is true", () => {
    const favoriteCharacter = { ...baseCharacter, isFavorite: true };
    render(<Card {...favoriteCharacter} />);
    expect(screen.getByTestId("heart-icon")).toHaveClass("active");
  });
});