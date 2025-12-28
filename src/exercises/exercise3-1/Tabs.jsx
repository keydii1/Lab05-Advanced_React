import { createContext, useContext, useState } from "react";
import "./Tabs.css";

// ======================================
// EXERCISE 3.1: Compound Tabs Component
// ======================================
// Context: The Compound Component pattern (like <select> and <option>)
// allows components to share implicit state using Context,
// providing a flexible API for consumers.

// Create context for sharing tab state
const TabsContext = createContext();

// Custom hook to use Tabs context
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "Tabs compound components must be used within a <Tabs> parent"
    );
  }
  return context;
}

// ======================================
// Parent Tabs Component
// ======================================
function Tabs({ children, defaultIndex = 0 }) {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);

  const value = {
    activeTabIndex,
    setActiveTabIndex,
  };

  return (
    <TabsContext.Provider value={value}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

// ======================================
// Tabs.List - Container for tab buttons
// ======================================
function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
}

// ======================================
// Tabs.Tab - Individual tab button
// ======================================
function Tab({ children, index }) {
  const { activeTabIndex, setActiveTabIndex } = useTabsContext();
  const isActive = activeTabIndex === index;

  return (
    <button
      className={`tab-button ${isActive ? "active" : ""}`}
      onClick={() => setActiveTabIndex(index)}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}

// ======================================
// Tabs.Panel - Tab content panel
// ======================================
function Panel({ children, index }) {
  const { activeTabIndex } = useTabsContext();
  const isActive = activeTabIndex === index;

  if (!isActive) return null;

  return (
    <div className="tab-panel" role="tabpanel">
      {children}
    </div>
  );
}

// Attach compound components to Tabs
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

// ======================================
// Demo Component
// ======================================
export default function TabsDemo() {
  return (
    <div className="tabs-demo-container">
      <h2>Exercise 3.1: Compound Tabs Component</h2>
      <p className="description">
        This component uses the <code>Compound Component</code> pattern with{" "}
        <code>Context</code> to share state between <code>Tabs</code>,{" "}
        <code>Tabs.List</code>, <code>Tabs.Tab</code>, and{" "}
        <code>Tabs.Panel</code>.
      </p>

      {/* Example usage - same as required in the exercise */}
      <Tabs defaultIndex={0}>
        <Tabs.List>
          <Tabs.Tab index={0}>⚛️ React</Tabs.Tab>
          <Tabs.Tab index={1}>🔄 Redux</Tabs.Tab>
          <Tabs.Tab index={2}>📦 Next.js</Tabs.Tab>
        </Tabs.List>
        <div className="divider"></div> {/* Custom markup allowed here */}
        <Tabs.Panel index={0}>
          <div className="panel-content react">
            <h3>React</h3>
            <p>
              React is a JavaScript library for building user interfaces. It
              uses a component-based architecture and a virtual DOM for
              efficient rendering.
            </p>
            <ul>
              <li>Component-based architecture</li>
              <li>Virtual DOM for performance</li>
              <li>One-way data binding</li>
              <li>JSX syntax</li>
            </ul>
          </div>
        </Tabs.Panel>
        <Tabs.Panel index={1}>
          <div className="panel-content redux">
            <h3>Redux</h3>
            <p>
              Redux is a predictable state container for JavaScript apps. It
              helps you write applications that behave consistently and are easy
              to test.
            </p>
            <ul>
              <li>Single source of truth</li>
              <li>State is read-only</li>
              <li>Changes made with pure functions</li>
              <li>Redux Toolkit for simplified setup</li>
            </ul>
          </div>
        </Tabs.Panel>
        <Tabs.Panel index={2}>
          <div className="panel-content nextjs">
            <h3>Next.js</h3>
            <p>
              Next.js is a React framework that enables server-side rendering,
              static site generation, and more for production-ready
              applications.
            </p>
            <ul>
              <li>Server-side rendering (SSR)</li>
              <li>Static site generation (SSG)</li>
              <li>API routes</li>
              <li>File-based routing</li>
            </ul>
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* API Documentation */}
      <div className="api-docs">
        <h4>📖 Component API</h4>
        <div className="api-grid">
          <div className="api-item">
            <code>&lt;Tabs defaultIndex={"{0}"}&gt;</code>
            <p>Parent component that provides context</p>
          </div>
          <div className="api-item">
            <code>&lt;Tabs.List&gt;</code>
            <p>Container for tab buttons</p>
          </div>
          <div className="api-item">
            <code>&lt;Tabs.Tab index={"{n}"}&gt;</code>
            <p>Individual tab button with index</p>
          </div>
          <div className="api-item">
            <code>&lt;Tabs.Panel index={"{n}"}&gt;</code>
            <p>Content panel shown when tab is active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Tabs component for external use
export { Tabs };
