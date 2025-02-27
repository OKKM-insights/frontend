import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

describe("Loading Spinner Component", () => {
    test("renders correctly", () => {
        render(<LoadingSpinner />);
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
});