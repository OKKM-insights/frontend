import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewProjDialog from "@/components/NewProjDialog";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>

describe("NewProjDialog Component", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 123 } });
  });

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  test("renders the Create New Project button", () => {
    render(<NewProjDialog />);
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
  });

  test("opens the dialog when Create New Project button is clicked", () => {
    render(<NewProjDialog />);
    const button = screen.getByRole('button', { name: /create new project/i });

    fireEvent.click(button);
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
  });

  test("shows validation error if required fields are empty", async () => {
    render(<NewProjDialog />);
    fireEvent.click(screen.getByText("Create New Project"));
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
    
    await waitFor(() => {
      expect(screen.findByText("Name can not be empty")).resolves.toBeInTheDocument();
      expect(screen.findByText("Desc can not be empty")).resolves.toBeInTheDocument();
      expect(screen.findByText("Categories can not be empty")).resolves.toBeInTheDocument();
    });
  });

  test("submits form successfully and shows success message", async () => {
    mockAxios.post.mockResolvedValue({ status: 200 });
    render(<NewProjDialog />);
    
    fireEvent.click(screen.getByText("Create New Project"));
    fireEvent.change(screen.getByLabelText("Project Name"), { target: { value: "Test Project" } });
    fireEvent.change(screen.getByLabelText("Project Description"), { target: { value: "Test Description" } });
    fireEvent.change(screen.getByLabelText("What are you looking to find in these images?"), { target: { value: "Test Category" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
    
    await waitFor(() => {
      expect(screen.findByText("Project Created")).resolves.toBeInTheDocument();
    });
  });

  test("shows error message if project creation fails", async () => {
    mockAxios.post.mockRejectedValue(new Error("Request failed"));
    render(<NewProjDialog />);
    
    fireEvent.click(screen.getByText("Create New Project"));
    fireEvent.change(screen.getByLabelText("Project Name"), { target: { value: "Test Project" } });
    fireEvent.change(screen.getByLabelText("Project Description"), { target: { value: "Test Description" } });
    fireEvent.change(screen.getByLabelText("What are you looking to find in these images?"), { target: { value: "Test Category" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
    
    await waitFor(() => {
      expect(screen.findByText("Project Creation Failed. Please Try Again")).resolves.toBeInTheDocument();
    });
  });
});
