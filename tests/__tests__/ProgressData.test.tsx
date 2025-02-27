import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressData from "../../src/components/ProgressData";

describe("Progress Data Component", () => {
    test("renders correctly", () => {
        const progressData = {
            completionPercentage: 100,
            labeledPhotos: 6500,
            totalPhotos: 10000,
            timeRemaining: "3 days 5 hours"
        }
        render(<ProgressData {...progressData} />);
        expect(screen.getByText("Progress Tracking")).toBeInTheDocument();
    });
});