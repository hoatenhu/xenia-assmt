import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import DataForm from "../components/DataForm/DataForm";

test("Renders the DataForm component", () => {
  render(<DataForm onUploadDone={() => {}} />);
  expect(true).toBeTruthy();
});
