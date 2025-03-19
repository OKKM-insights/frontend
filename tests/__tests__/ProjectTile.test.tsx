import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ProjectTile from "@/components/ProjectTile";
import "@testing-library/jest-dom";
import React from 'react';
import { useAuth } from "@/context/AuthContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

describe("ProjectTile Component", () => {
  let mockPush : jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders project title and description", () => {
    render(<ProjectTile project={{ id: "123", title: "Test Project", description: "Project description", type: "client", status: "live" }} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Project description")).toBeInTheDocument();
  });

  test("renders progress bar for inprogress status", () => {
    render(<ProjectTile project={{id: "123", description: "Project description",  title: "Progress Project", type: "client", status: "inprogress", progress: 50 }} />);
    expect(screen.getByText("50% Complete")).toBeInTheDocument();
  });

  test("renders NewProjDialog when project status is 'new'", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 123 } });
    render(<ProjectTile project={{id: "123", description: "Project description",  title: "New Project", type: "client", status: "new" }} />);
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
  });

  test("navigates to label project when type is 'label'", () => {
    render(<ProjectTile project={{ title: "Label Project", id: "123", description: "Project description", type: "label", status: "live" }} />);
    fireEvent.click(screen.getByText("Start Labeling"));
    expect(mockPush).toHaveBeenCalledWith("/label/123");
  });

  test("navigates to client project when type is 'client'", () => {
    render(<ProjectTile project={{id: "123", description: "Project description",  title: "Client Project", type: "client", status: "live" }} />);
    fireEvent.click(screen.getByText("Start Labeling"));
    expect(mockPush).toHaveBeenCalledWith("/project/123");
  });

  test("button text changes based on status", () => {
    const { rerender } = render(<ProjectTile project={{id: "123", description: "Project description",  type: "label", title: "Project A", status: "live" }} />);
    expect(screen.getByText("Start Labeling")).toBeInTheDocument();
    
    rerender(<ProjectTile project={{id: "123", description: "Project description", type: "label",  title: "Project B", status: "inprogress" }} />);
    expect(screen.getByText("Continue")).toBeInTheDocument();

    rerender(<ProjectTile project={{id: "123", description: "Project description", type: "label",  title: "Project C", status: "current" }} />);
    expect(screen.getByText("View Progress")).toBeInTheDocument();
  });
});