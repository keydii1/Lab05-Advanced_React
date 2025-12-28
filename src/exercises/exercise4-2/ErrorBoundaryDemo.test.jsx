import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "react-error-boundary";
import { Bomb, ErrorFallback } from "./ErrorBoundaryDemo";

// ======================================
// EXERCISE 4.2: Testing Error Boundaries
// ======================================
// Tests verify that error boundaries properly catch errors
// and display fallback UI

describe("ErrorBoundary", () => {
  let consoleSpy;

  // Silence console.error during tests to keep logs clean
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Test 1: Bomb component throws error when shouldExplode is true
  it("Bomb component throws error when shouldExplode is true", () => {
    expect(() => {
      render(<Bomb shouldExplode={true} />);
    }).toThrow("Boom!");
  });

  // Test 2: Bomb component renders safely when shouldExplode is false
  it("Bomb component renders safely when shouldExplode is false", () => {
    render(<Bomb shouldExplode={false} />);

    expect(screen.getByText(/bomb defused/i)).toBeInTheDocument();
  });

  // Test 3: ErrorBoundary shows fallback when child throws error
  it("shows fallback UI when child component throws error", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    // Assert: Fallback UI is visible
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();
  });

  // Test 4: ErrorBoundary renders children normally when no error
  it("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldExplode={false} />
      </ErrorBoundary>
    );

    // Assert: Normal content is visible
    expect(screen.getByText(/bomb defused/i)).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  // Test 5: Reset button is present in fallback
  it("shows retry button in fallback UI", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });

  // Test 6: Error message contains the error details
  it("displays the error message in fallback UI", () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/the component exploded/i)).toBeInTheDocument();
  });

  // Test 7: onReset callback is called when retry button is clicked
  it("calls onReset when retry button is clicked", async () => {
    const user = userEvent.setup();
    const mockReset = vi.fn();

    // We need a controlled component to test reset
    let shouldExplode = true;

    const { rerender } = render(
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          mockReset();
          shouldExplode = false;
        }}
        resetKeys={[shouldExplode]}
      >
        <Bomb shouldExplode={shouldExplode} />
      </ErrorBoundary>
    );

    // Error was caught, fallback is shown
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Click retry
    await user.click(screen.getByRole("button", { name: /try again/i }));

    // Assert: onReset was called
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  // Test 8: Multiple ErrorBoundaries are isolated
  it("error in one boundary does not affect another", () => {
    render(
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Bomb shouldExplode={true} />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Bomb shouldExplode={false} />
        </ErrorBoundary>
      </div>
    );

    // First boundary shows error
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Second boundary shows normal content
    expect(screen.getByText(/bomb defused/i)).toBeInTheDocument();
  });
});
