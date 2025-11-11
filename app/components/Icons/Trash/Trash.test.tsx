import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Trash from "./Trash";

describe("Trash icon", () => {
  it("renderiza el svg con atributos básicos y sus elementos internos", () => {
    const { container } = render(<Trash />);
    const svg = container.querySelector("svg") as SVGElement;

    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("width")).toBe("15");
    expect(svg.getAttribute("height")).toBe("21");
    expect(svg.getAttribute("viewBox")).toBe("0 0 15 21");

    // Un icono con path de contorno + 4 rects (3 barras + tapa)
    const paths = container.querySelectorAll("path");
    const rects = container.querySelectorAll("rect");
    expect(paths.length).toBe(2);
    expect(rects.length).toBe(4);

    // Verifica algunos atributos específicos
    expect(paths[0].getAttribute("stroke")).toBe("white");
    expect(rects[0].getAttribute("fill")).toBe("#D9D9D9");
  });

  it("dispara onClick cuando se hace click en el svg", () => {
    const handleClick = vi.fn();
    const { container } = render(<Trash onClick={handleClick} />);
    const svg = container.querySelector("svg") as SVGElement;

    fireEvent.click(svg);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no lanza error al hacer click si no se pasa onClick", () => {
    const { container } = render(<Trash />);
    const svg = container.querySelector("svg") as SVGElement;

    expect(() => fireEvent.click(svg)).not.toThrow();
  });
});