import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

// ======================================
// EXERCISE 4.1: Integration Testing a Form
// ======================================
// Tests focus on user behavior, not implementation details

describe("LoginForm", () => {
  // Test 1: Renders the form correctly
  it("renders the login form with email and password inputs", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // Test 2: Shows error when fields are empty
  it("shows error message when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Act: Click submit without filling fields
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Assert: Error message is visible
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fill in all fields/i
    );
  });

  // Test 3: Shows loading state when submitting
  it("shows loading state while submitting", async () => {
    const user = userEvent.setup();

    // Mock the login API to be slow
    const mockLogin = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginForm onLogin={mockLogin} />);

    // Act: Fill in the form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Assert: Button shows loading text
    expect(screen.getByRole("button")).toHaveTextContent(/logging in/i);
  });

  // Test 4: Shows success message on successful login
  it("shows welcome message on successful login", async () => {
    const user = userEvent.setup();

    // Mock successful login
    const mockLogin = vi.fn().mockResolvedValue({
      success: true,
      user: { email: "test@example.com", name: "Test User" },
    });

    render(<LoginForm onLogin={mockLogin} />);

    // Arrange: Fill in the form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    // Act: Submit the form
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Assert: Welcome message appears (multiple elements match, use heading)
    expect(
      await screen.findByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
    expect(await screen.findByText(/test user/i)).toBeInTheDocument();
  });

  // Test 5: Shows error message on failed login
  it("shows error message on failed login", async () => {
    const user = userEvent.setup();

    // Mock failed login
    const mockLogin = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    render(<LoginForm onLogin={mockLogin} />);

    // Arrange: Fill in the form
    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");

    // Act: Submit the form
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Assert: Error message appears
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  // Test 6: API is called with correct credentials
  it("calls the login API with the correct email and password", async () => {
    const user = userEvent.setup();

    const mockLogin = vi.fn().mockResolvedValue({
      success: true,
      user: { email: "test@example.com", name: "Test User" },
    });

    render(<LoginForm onLogin={mockLogin} />);

    // Arrange & Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Assert: API was called with correct args
    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  // Test 7: Logout functionality
  it("allows user to logout after successful login", async () => {
    const user = userEvent.setup();

    const mockLogin = vi.fn().mockResolvedValue({
      success: true,
      user: { email: "test@example.com", name: "Test User" },
    });

    render(<LoginForm onLogin={mockLogin} />);

    // Login first
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Wait for success (use heading to avoid multiple matches)
    await screen.findByRole("heading", { name: /welcome back/i });

    // Act: Click logout
    await user.click(screen.getByRole("button", { name: /logout/i }));

    // Assert: Back to login form
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
