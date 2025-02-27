import { render, screen, fireEvent } from "@testing-library/react";
import ProjectSection from "@/components/ProjectSection";
import "@testing-library/jest-dom";
import React from "react";
import { Project } from "@/types";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn()
  }));

describe("ProjectSection Component", () => {
  let mockPush : jest.Mock;
  
  beforeEach(() => {
        mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        HTMLElement.prototype.scrollBy = jest.fn();
  });
  const mockProjects = [
    { id: "1", title: "Project 1", type: "label", status: "live", description: "dsad", progress: 0} as Project,
    { id: "2", title: "Project 2", type: "client", status: "current", description: "dsad", progress: 0 } as Project,
  ];

  test("renders section with correct title and color", () => {
    render(<ProjectSection title="Live Projects" projects={mockProjects} color="blue" />);

    const titleElement = screen.getByText("Live Projects");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle("color: blue");
  });

  test("displays correct number of ProjectTile components", () => {
    render(<ProjectSection title="Live Projects" projects={mockProjects} color="blue" />);

    const projectTiles = screen.getAllByText(/Project \d/);
    expect(projectTiles).toHaveLength(mockProjects.length);
  });

  test("shows 'No Live Projects' message when there are no projects", () => {
    render(<ProjectSection title="Live Projects" projects={[]} color="blue" />);

    expect(screen.getByText("No Live Projects")).toBeInTheDocument();
  });

  test("scroll buttons exist and can be clicked", () => {
    render(<ProjectSection title="Live Projects" projects={mockProjects} color="blue" />);
    
    const leftButton = screen.getByRole("button", { name: "<" });
    const rightButton = screen.getByRole("button", { name: ">" });

    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();

    fireEvent.click(leftButton);
    fireEvent.click(rightButton);
  });
});