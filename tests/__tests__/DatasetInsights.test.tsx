import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataInsights from "../../src/components/DatasetInsights";

describe("DatasetInsights Component", () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });
    test("renders correctly", () => {
        const categoryData = [
            { name: 'Building', value: 4000 },
            { name: 'Vehicle', value: 3000 },
            { name: 'Vegetation', value: 2000 },
            { name: 'Water', value: 1000 },
        ]
        render(<DataInsights categoryData={categoryData} />);
        expect(screen.getByText("Dataset Insights")).toBeInTheDocument();
    });
});