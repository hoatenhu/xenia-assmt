import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import DisplayData from "../components/DataList/DataList";

test("Renders the DisplayData component", () => {
  render(<DisplayData />);
  expect(true).toBeTruthy();
});
