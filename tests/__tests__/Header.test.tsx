import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Header Component", () => {
  let mockPush: jest.Mock;
  let mockLogout: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockLogout = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ user: { profilePicture: "" }, logout: mockLogout });
  });

  test("renders OrbitWatch logo and name", () => {
    render(<Header status="not_logged_in" />);
    
    expect(screen.getByAltText("EarthLabel Logo")).toBeInTheDocument();
    expect(screen.getByText("OrbitWatch")).toBeInTheDocument();
  });

  test("shows login and register buttons when logged out", () => {
    render(<Header status="not_logged_in" />);
    
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("shows avatar and logout button when logged in", () => {
    render(<Header status="logged_in" />);
    
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
  });

  test("navigates to login when clicking the login button", () => {
    render(<Header status="not_logged_in" />);
    
    fireEvent.click(screen.getByText("Login"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  test("navigates to register when clicking the register button", () => {
    render(<Header status="not_logged_in" />);
    
    fireEvent.click(screen.getByText("Register"));
    expect(mockPush).toHaveBeenCalledWith("/register");
  });

  test("logs out when clicking the logout button", () => {
    render(<Header status="logged_in" />);
    
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test("navigates to home when clicking the OrbitWatch logo", () => {
    render(<Header status="not_logged_in" />);
    
    fireEvent.click(screen.getByText("OrbitWatch"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("navigates to information when clicking avatar", () => {
    render(<Header status="logged_in" />);
    
    fireEvent.click(screen.getByTestId("user-avatar"));
    expect(mockPush).toHaveBeenCalledWith("/information");
  });
});