import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SuccessPopup } from "@/components/SuccessPopup";

describe("Success Pop Up Component", () => {
    test("renders correctly", () => {
        render(<SuccessPopup message="Good Job" />);
        expect(screen.getByText("Good Job")).toBeInTheDocument();
    });
});