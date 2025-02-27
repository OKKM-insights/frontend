import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import "@testing-library/jest-dom";
import LabelStudioUI from "../src/components/LabelStudioUI";

jest.mock("axios");

const mockProjectDetails = {
  categories: "Car, Tree, Road",
};
const mockImages = {
  images: [{ id: 1, orig_image_id: 101, image: "base64data", x_offset: 0, y_offset: 0, image_width: 300, image_height: 300 }],
};

describe("LabelStudioUI Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner initially", () => {
    render(<LabelStudioUI id="123" userId="456" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("fetches and displays project details and images", async () => {
    axios.get.mockResolvedValueOnce({ data: mockProjectDetails });
    axios.get.mockResolvedValueOnce({ data: mockImages });

    render(<LabelStudioUI id="123" userId="456" />);

    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    expect(screen.getByText("Project Complete")).toBeInTheDocument();
  });

  test("handles API error and displays error message", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<LabelStudioUI id="123" userId="456" />);

    await waitFor(() => expect(screen.getByText("Failed to fetch")).toBeInTheDocument());
  });

  test("handles label submission correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    axios.get.mockResolvedValueOnce({ data: mockProjectDetails });
    axios.get.mockResolvedValueOnce({ data: mockImages });

    render(<LabelStudioUI id="123" userId="456" />);

    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    
    userEvent.click(screen.getByText("Project Complete")); // Simulating label submission
    
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });
});
