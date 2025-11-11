import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Heart from "./Heart";

describe("Heart", () => {
  it("renderiza el svg y aplica className", () => {
    const { container } = render(<Heart className="mi-clase" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("class")).toContain("mi-clase");
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("21");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 21");

    const path = container.querySelector("path") as SVGPathElement;
    expect(path).toBeInTheDocument();
    expect(path.getAttribute("fill")).toBe("currentColor");
  });

  it("dispara onClick cuando se hace click en el svg", () => {
    const handleClick = vi.fn();
    const { container } = render(<Heart className="c" onClick={handleClick} />);
    const svg = container.querySelector("svg") as SVGElement;
    svg && svg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no truena si no se pasa onClick", () => {
    const { container } = render(<Heart className="c" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(() =>
      svg.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    ).not.toThrow();
  });
});
