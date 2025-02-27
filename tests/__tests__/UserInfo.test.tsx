import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserInfo from '@/components/UserInfo'
import { useAuth } from "@/context/AuthContext";
import axios from 'axios'
import React from 'react';
import "@testing-library/jest-dom";

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn() }),
}))

jest.mock("@/context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

describe('UserInfo Component', () => {
  const mockSetUser = jest.fn()
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    userType: 'labeller',
    firstName: 'John',
    lastName: 'Doe',
    skills: 'React, Node.js',
    availability: 40,
    profilePicture: '',
  }

  const renderComponent = (userType: 'labeller' | 'client') => {
    (useAuth as jest.Mock).mockReturnValue({ user: { ...mockUser, userType }, setUser: mockSetUser });
    return render(
        <UserInfo userType={userType} />
    )
  }

  test('renders correctly for labeller', () => {
    renderComponent('labeller')
    
    expect(screen.getByText('User Information')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toHaveValue(mockUser.email)
    expect(screen.getByLabelText(/First Name/i)).toHaveValue(mockUser.firstName)
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue(mockUser.lastName)
    expect(screen.getByLabelText(/Skills/i)).toHaveValue(mockUser.skills)
    expect(screen.getByLabelText(/Availability/i)).toHaveValue(mockUser.availability)
  })

  test('enables edit mode when clicking "Edit"', () => {
    renderComponent('labeller')

    fireEvent.click(screen.getByText(/Edit/i))
    
    expect(screen.getByLabelText(/Email/i)).not.toBeDisabled()
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument()
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
  })

  test('submits updated user info', async () => {
    mockAxios.put.mockResolvedValue({ status: 200 })

    renderComponent('labeller')

    fireEvent.click(screen.getByText(/Edit/i))

    const emailInput = screen.getByLabelText(/Email/i)
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } })

    fireEvent.click(screen.getByText(/Save Changes/i))

    await waitFor(() => expect(mockAxios.put).toHaveBeenCalledTimes(1))
    expect(mockAxios.put).toHaveBeenCalledWith(expect.stringContaining('/api/update-user/'), expect.objectContaining({
      email: 'updated@example.com',
    }), expect.objectContaining({
        headers: {"Content-Type": "application/json"},
    }))
  })

  test('shows error message on duplicate email', async () => {
    mockAxios.put.mockRejectedValue({ response: { data: { error: 'Duplicate entry' } } })

    renderComponent('labeller')

    fireEvent.click(screen.getByText(/Edit/i))

    const emailInput = screen.getByLabelText(/Email/i)
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })

    fireEvent.click(screen.getByText(/Save Changes/i))

    await waitFor(() => screen.getByText('Account with this email already exists'))
    expect(screen.getByText('Account with this email already exists')).toBeInTheDocument()
  })
})
