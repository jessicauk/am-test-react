import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Status from "./Status";

// Mock de CSS Modules para no depender de hashes
vi.mock("./Status.module.css", () => ({
  default: {
    status: "status",
    indicator: "indicator",
    alive: "alive",
    dead: "dead",
  },
}));

describe("Status", () => {
  it("muestra LIVE y aplica clase 'alive' cuando isAlive=true", () => {
    const { container } = render(<Status isAlive={true} />);
    const root = container.firstElementChild as HTMLElement;

    // Texto
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    // Clases del contenedor
    expect(root.className).toContain("status");

    // Indicador con clases indicator + alive
    const indicator =
      root.querySelector("div > .indicator") || root.querySelector("div div");
    expect(indicator).toBeTruthy();
    expect((indicator as HTMLElement).className).toContain("indicator");
    expect((indicator as HTMLElement).className).toContain("alive");
    expect((indicator as HTMLElement).className).not.toContain("dead");
  });

  it("muestra DEATH y aplica clase 'dead' cuando isAlive=false", () => {
    const { container } = render(<Status isAlive={false} />);
    const root = container.firstElementChild as HTMLElement;

    expect(screen.getByText("DEATH")).toBeInTheDocument();
    expect(root.className).toContain("status");

    const indicator =
      root.querySelector("div > .indicator") || root.querySelector("div div");
    expect(indicator).toBeTruthy();
    expect((indicator as HTMLElement).className).toContain("indicator");
    expect((indicator as HTMLElement).className).toContain("dead");
    expect((indicator as HTMLElement).className).not.toContain("alive");
  });

  it("por defecto (isAlive undefined) se comporta como false: DEATH + 'dead'", () => {
    const { container } = render(<Status />);
    const root = container.firstElementChild as HTMLElement;

    expect(screen.getByText("DEATH")).toBeInTheDocument();
    expect(root.className).toContain("status");

    const indicator =
      root.querySelector("div > .indicator") || root.querySelector("div div");
    expect(indicator).toBeTruthy();
    expect((indicator as HTMLElement).className).toContain("indicator");
    expect((indicator as HTMLElement).className).toContain("dead");
  });
});
