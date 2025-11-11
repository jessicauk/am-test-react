import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Search from "./Search";

describe("Search icon", () => {
  it("renderiza el svg con atributos básicos y un path con currentColor", () => {
    const { container } = render(<Search />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("width")).toBe("18");
    expect(svg.getAttribute("height")).toBe("18");
    expect(svg.getAttribute("viewBox")).toBe("0 0 18 18");

    const path = container.querySelector("path") as SVGPathElement;
    expect(path).toBeInTheDocument();
    expect(path.getAttribute("fill")).toBe("currentColor");
  });
});
