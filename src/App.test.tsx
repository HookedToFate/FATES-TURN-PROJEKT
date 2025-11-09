import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the hero statement", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /living reliquary/i })
    ).toBeInTheDocument();
  });

  it("lists multiple lore fragments", () => {
    render(<App />);
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
