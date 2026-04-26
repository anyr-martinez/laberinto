import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza el titulo del juego", () => {
  render(<App />);
  const titleElement = screen.getByText(/trivia del caf/i);
  expect(titleElement).toBeInTheDocument();
});
