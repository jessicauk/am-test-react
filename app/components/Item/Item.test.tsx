import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Item from "./Item.module";

// Mock de CSS Modules para evitar hashes en className
vi.mock("./Item.module.css", () => ({
  default: {
    primaryText: "primaryText",
    secondaryText: "secondaryText",
  },
}));

describe("Item", () => {
  it("renderiza title, value e info con sus clases", () => {
    render(<Item title="Status:" value="Alive" info="(Human)" />);

    // El contenedor principal <p>
    const p = screen.getByText(/Status:/).closest("p") as HTMLElement;
    expect(p).toBeInTheDocument();
    expect(p.className).toContain("primaryText");

    // Los dos spans con secondaryText
    const spans = p.querySelectorAll("span");
    expect(spans.length).toBe(2);
    expect(spans[0].className).toContain("secondaryText");
    expect(spans[1].className).toContain("secondaryText");

    // Contenido
    expect(p).toHaveTextContent("Status:");
    expect(spans[0]).toHaveTextContent("Alive");
    expect(spans[1]).toHaveTextContent("(Human)");
  });

  it("usa string vacío cuando faltan props", () => {
    // Solo value
    const { rerender } = render(<Item title="" value={42} />);
    let p = screen.getByText("42").closest("p") as HTMLElement; // value en primer span
    let spans = p.querySelectorAll("span");
    expect(p).toBeInTheDocument();
    expect(p.textContent).toBe(`42`); // title "" + value "42" + info ""
    expect(spans[0]).toHaveTextContent("42");
    expect(spans[1]).toHaveTextContent(""); // info ausente -> ""

    // Solo title
    rerender(<Item title="Episodes:" value="" />);
    p = screen.getByText("Episodes:").closest("p") as HTMLElement;
    spans = p.querySelectorAll("span");
    expect(spans[0]).toHaveTextContent(""); // value ausente -> ""
    expect(spans[1]).toHaveTextContent(""); // info ausente -> ""
  });

  it("acepta numbers en value y los muestra como texto", () => {
    render(<Item title="Episodes:" value={31} info="(S1–S3)" />);
    const p = screen.getByText(/Episodes:/).closest("p") as HTMLElement;
    const spans = p.querySelectorAll("span");
    expect(spans[0]).toHaveTextContent("31");
    expect(spans[1]).toHaveTextContent("(S1–S3)");
  });
});