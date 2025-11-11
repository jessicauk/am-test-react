import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ListItem from "./ListItem";

// Mock del CSS Module
vi.mock("./ListItem.module.css", () => ({
  default: { container: "container" },
}));

// El componente usa el componente`../Item/Item.module`.
vi.mock("../Item/Item.module", () => ({
  __esModule: true,
  default: ({ title, value, info }: { title: string; value: string | number; info?: string }) => (
    <p data-testid="mock-item">
      {title}
      <span>{String(value ?? "")}</span>
      <span>{info ?? ""}</span>
    </p>
  ),
}));

describe("ListItem", () => {
  it("renderiza 'No data available' cuando data está vacío o no existe", () => {
    const { rerender } = render(<ListItem data={[]} />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();

    // @ts-expect-error: ausencia de prop
    rerender(<ListItem />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it("renderiza un Item por cada elemento de data", () => {
    const data = [
      { title: "Status:", value: "Alive", info: "(Human)" },
      { title: "Episodes:", value: 31 },
      { title: "Origin:", value: "Earth (C-137)" },
    ];

    render(<ListItem data={data} />);

    const items = screen.getAllByTestId("mock-item");
    expect(items).toHaveLength(3);

    // Verifica contenido del primero
    expect(items[0]).toHaveTextContent("Status:");
    expect(items[0].querySelectorAll("span")[0]).toHaveTextContent("Alive");
    expect(items[0].querySelectorAll("span")[1]).toHaveTextContent("(Human)");

    // Segundo (number → string)
    expect(items[1]).toHaveTextContent("Episodes:");
    expect(items[1].querySelectorAll("span")[0]).toHaveTextContent("31");

    // Tercero
    expect(items[2]).toHaveTextContent("Origin:");
    expect(items[2].querySelectorAll("span")[0]).toHaveTextContent("Earth (C-137)");
  });

  it("envuelve los Items dentro del contenedor con la clase del CSS module", () => {
    const data = [{ title: "A", value: "B" }];
    const { container } = render(<ListItem data={data} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root.className).toContain("container");
  });
});