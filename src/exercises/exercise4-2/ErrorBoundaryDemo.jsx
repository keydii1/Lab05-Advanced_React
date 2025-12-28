import { ErrorBoundary } from "react-error-boundary";
import "./ErrorBoundaryDemo.css";

// ======================================
// EXERCISE 4.2: Testing Error Boundaries
// ======================================
// Context: Error Boundaries are components that catch JavaScript errors
// in their child component tree. The react-error-boundary library
// provides a functional wrapper for this.

// ======================================
// "Bomb" Component - Throws error when rendered
// ======================================
export function Bomb({ shouldExplode = true }) {
  if (shouldExplode) {
    throw new Error("💥 Boom! The component exploded!");
  }
  return (
    <div className="safe-component">✅ Bomb defused - Component is safe!</div>
  );
}

// ======================================
// Fallback UI Component
// ======================================
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback" role="alert">
      <div className="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p className="error-message">{error.message}</p>
      <button onClick={resetErrorBoundary} className="retry-button">
        Try Again
      </button>
    </div>
  );
}

// ======================================
// Demo Component
// ======================================
export default function ErrorBoundaryDemo() {
  return (
    <div className="error-boundary-container">
      <h2>Exercise 4.2: Error Boundary Testing</h2>
      <p className="description">
        This component demonstrates <code>ErrorBoundary</code> from{" "}
        <code>react-error-boundary</code>. The "Bomb" component throws an error,
        but the ErrorBoundary catches it and shows a fallback UI.
      </p>

      <div className="demo-grid">
        {/* Working Component */}
        <div className="demo-card safe">
          <h3>✅ Safe Component</h3>
          <p>This component works normally</p>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Bomb shouldExplode={false} />
          </ErrorBoundary>
        </div>

        {/* Error Component with Boundary */}
        <div className="demo-card danger">
          <h3>💣 Explosive Component</h3>
          <p>This component throws an error, but it's caught!</p>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // Reset application state if needed
              console.log("Error boundary reset");
            }}
          >
            <Bomb shouldExplode={true} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Testing Tips */}
      <div className="testing-tips">
        <h4>🧪 How to Test Error Boundaries</h4>
        <div className="test-code">
          <pre>{`import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Bomb, ErrorFallback } from './ErrorBoundaryDemo';

describe('ErrorBoundary', () => {
  it('shows fallback UI when child throws error', () => {
    // Silence console.error during test
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    // Assert fallback is visible
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();

    spy.mockRestore();
  });
});`}</pre>
        </div>
      </div>

      {/* Explanation */}
      <div className="explanation">
        <h4>💡 Key Concepts</h4>
        <div className="concepts-grid">
          <div className="concept">
            <code>ErrorBoundary</code>
            <p>Wraps components that might throw errors</p>
          </div>
          <div className="concept">
            <code>FallbackComponent</code>
            <p>UI to show when an error occurs</p>
          </div>
          <div className="concept">
            <code>resetErrorBoundary</code>
            <p>Function to retry rendering the component</p>
          </div>
          <div className="concept">
            <code>onError</code>
            <p>Callback for logging errors to services</p>
          </div>
        </div>
      </div>
    </div>
  );
}
