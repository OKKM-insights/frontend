import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WorkPerformance from "../../src/components/WorkPerformance";

describe("Work Performance Component", () => {
    test("renders correctly", () => {
        const workforceData = {
            avgLabelSpeed: 45,
            totalLabelers: 12,
            topPerformers: [
                { name: "Alice", contribution: 1200, accuracy: 98 },
                { name: "Bob", contribution: 1100, accuracy: 97 },
                { name: "Charlie", contribution: 1000, accuracy: 96 }
            ]
        }
        render(<WorkPerformance {...workforceData} />);
        expect(screen.getByText("Workforce Performance")).toBeInTheDocument();
    });
});