import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import QualityData from "../../src/components/QualityData";

describe("Quality Data Component", () => {
    test("renders correctly", () => {
        const qualityData = {
            accuracyRate: 92,
            disputedLabels: 215,
            reviewProgress: 70
        }
        render(<QualityData {...qualityData} />);
        expect(screen.getByText("Quality Assurance")).toBeInTheDocument();
    });
});