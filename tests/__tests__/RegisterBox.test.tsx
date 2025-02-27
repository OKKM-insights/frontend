import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterBox from "@/components/RegisterBox";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>

describe("RegisterBox Component", () => {
    let mockPush : jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    test("renders the RegisterBox component correctly", () => {
        render(<RegisterBox />);
        expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Labeller" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Client/i })).toBeInTheDocument();
    });

    test("switches between Labeller and Client tabs", () => {
        render(<RegisterBox />);

        const labellerTab = screen.getByRole("button", { name: "Labeller" });
        const clientTab = screen.getByRole("button", { name: /Client/i });

        fireEvent.click(clientTab);
        expect(clientTab).toHaveClass("border-b-2 border-blue-600 font-semibold");

        fireEvent.click(labellerTab);
        expect(labellerTab).toHaveClass("border-b-2 border-blue-600 font-semibold");
    });

    test("validates password requirements dynamically", () => {
        render(<RegisterBox />);

        const passwordInput = screen.getByLabelText("Password");
        fireEvent.change(passwordInput, { target: { value: "abc123!" } });

        expect(screen.getByText("Minimum 8 characters")).toHaveClass("text-gray-400");
        expect(screen.getByText("At least one special character")).toHaveClass("text-green-500");
    });

    test("shows error if passwords do not match", () => {
        render(<RegisterBox />);

        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "DifferentPass!" } });
        fireEvent.submit(screen.getByRole("button", { name: /Register as Labeller/i }));

        expect(screen.getByText("Does not match Password")).toBeInTheDocument();
    });

    test("submits form successfully and redirects on success", async () => {
        mockAxios.post.mockResolvedValue({ status: 200 });

        render(<RegisterBox />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password123!" } });
        fireEvent.submit(screen.getByRole("button", { name: /Register as Labeller/i }));

        await waitFor(() => expect(screen.findByText("Registration Successful")).resolves.toBeInTheDocument());
    });

    test("shows error if registration fails", async () => {
        mockAxios.post.mockRejectedValue({ response: { data: { error: "Duplicate entry" } } });

        render(<RegisterBox />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "Password123!" } });
        fireEvent.submit(screen.getByRole("button", { name: /Register as Labeller/i }));

        await waitFor(() => expect(screen.getByText("Account with this email already exists")).toBeInTheDocument());
    });
});
