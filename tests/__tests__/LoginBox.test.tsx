import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginBox from "@/components/LoginBox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@testing-library/jest-dom";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginBox Component", () => {
  let loginMock: jest.Mock;
  let pushMock: jest.Mock;

  beforeEach(() => {
    loginMock = jest.fn();
    pushMock = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  test("renders correctly", () => {
    render(<LoginBox />);
    expect(screen.getByText("Login to OrbitWatch")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("allows typing in the email and password fields", () => {
    render(<LoginBox />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("calls login with correct credentials on form submission", async () => {
    render(<LoginBox />);
    
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("test@example.com", "password123", "labeller");
    });
  });

  test("displays an error message if login fails with 401", async () => {
    loginMock.mockRejectedValue({ status: 401 });

    render(<LoginBox />);
    
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials. Please try again")).toBeInTheDocument();
    });
  });

  test("navigates to register page when 'Register here' is clicked", () => {
    render(<LoginBox />);
    fireEvent.click(screen.getByText("Register here"));
    expect(pushMock).toHaveBeenCalledWith("/register");
  });

  test("allows switching user types", () => {
    render(<LoginBox />);
    fireEvent.click(screen.getByText("Client"));
    expect(screen.getByText("Client")).toHaveClass("border-b-2 border-blue-600 font-semibold");
  });
});