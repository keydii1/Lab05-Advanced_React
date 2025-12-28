import { Suspense, lazy } from "react";
import "./AdminPanel.css";

// ======================================
// EXERCISE 2.3: Route-Based Code Splitting
// ======================================
// Context: Code splitting allows you to split your bundle into smaller chunks,
// loading them only when needed. This is achieved using React.lazy and Suspense.

// Heavy component that simulates charting library (lazy loaded)
// In real world, this would be a heavy charting library like recharts, chart.js, etc.
const HeavyCharts = lazy(() => {
  // Simulate network delay for lazy loading
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(import("./HeavyCharts"));
    }, 1500);
  });
});

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="fancy-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading Admin Charts...</p>
      <p className="loading-subtext">
        This component is loaded lazily to reduce initial bundle size
      </p>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <div className="admin-panel-container">
      <h2>Exercise 2.3: Route-Based Code Splitting</h2>
      <p className="description">
        This component uses <code>React.lazy</code> and <code>Suspense</code> to
        lazy-load a heavy charting component. The HeavyCharts component is only
        loaded when this page is visited, reducing initial bundle size.
      </p>

      <div className="admin-header">
        <h3>📊 Admin Dashboard</h3>
        <span className="badge">Lazy Loaded</span>
      </div>

      <div className="admin-content">
        {/* Stats Overview */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-info">
              <h4>Total Users</h4>
              <p>12,458</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div className="stat-info">
              <h4>Orders</h4>
              <p>3,847</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <h4>Revenue</h4>
              <p>$284,592</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📈</span>
            <div className="stat-info">
              <h4>Growth</h4>
              <p>+24.5%</p>
            </div>
          </div>
        </div>

        {/* Lazy Loaded Charts */}
        <div className="charts-section">
          <h3>📈 Analytics Charts (Lazy Loaded)</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <HeavyCharts />
          </Suspense>
        </div>
      </div>

      {/* Code Splitting Info */}
      <div className="code-splitting-info">
        <h4>💡 How Code Splitting Works</h4>
        <div className="info-grid">
          <div className="info-item">
            <code>React.lazy()</code>
            <p>Dynamically imports the component, creating a separate chunk</p>
          </div>
          <div className="info-item">
            <code>&lt;Suspense&gt;</code>
            <p>Wraps lazy components and shows fallback while loading</p>
          </div>
          <div className="info-item">
            <code>fallback</code>
            <p>LoadingSpinner shown while the chunk is being downloaded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
