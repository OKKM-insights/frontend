import { render, screen, fireEvent } from "@testing-library/react";
import FailurePopup from "@/components/FailurePopup";
import "@testing-library/jest-dom";
import React from "react";

describe("FailurePopup Component", () => {
  test("renders correctly when open", () => {
    render(<FailurePopup open={true} onClose={() => {}} message="Test error message" />);
    
    expect(screen.getByText("Operation Failed")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    const { container } = render(<FailurePopup open={false} onClose={() => {}} message="Hidden message" />);
    
    expect(container).toBeEmptyDOMElement();
  });

  test("calls onClose when the Dialog is closed", () => {
    const mockClose = jest.fn();
    render(<FailurePopup open={true} onClose={mockClose} message="Test error message" />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});