import { useState, useMemo, useCallback, memo } from "react";
import "./Dashboard.css";

// ======================================
// EXERCISE 2.1 & 2.2: Performance Optimization
// ======================================
// Context: React.memo prevents unnecessary re-renders of child components
// when props haven't changed. useMemo caches expensive calculations.
// useCallback stabilizes function references for memoized components.

// Generate mock data (10,000 items)
const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    category: ["Electronics", "Clothing", "Food", "Books", "Sports"][
      Math.floor(Math.random() * 5)
    ],
  }));
};

const ITEMS = generateItems(10000);

// ======================================
// ListItem Component wrapped with React.memo
// ======================================
// This prevents re-render when parent's unrelated state changes
const ListItem = memo(function ListItem({ item, onDelete }) {
  // This log helps verify that items don't re-render unnecessarily
  console.log(`Rendering ListItem ${item.id}`);

  return (
    <div className="list-item">
      <span className="item-id">#{item.id}</span>
      <span className="item-name">{item.name}</span>
      <span className="item-value">${item.value}</span>
      <span className="item-category">{item.category}</span>
      <button onClick={() => onDelete(item.id)} className="delete-btn">
        ✕
      </button>
    </div>
  );
});

// ======================================
// Dashboard Component
// ======================================
export default function Dashboard() {
  const [theme, setTheme] = useState("light");
  const [sortOrder, setSortOrder] = useState("asc");
  const [items, setItems] = useState(ITEMS.slice(0, 100)); // Start with 100 items
  const [filterCategory, setFilterCategory] = useState("all");
  const [renderCount, setRenderCount] = useState(0);

  // Track renders
  console.log(`🔄 Dashboard rendered (count: ${renderCount})`);

  // ======================================
  // useMemo: Cache expensive sorting/filtering
  // ======================================
  // This only recalculates when items, sortOrder, or filterCategory changes
  // NOT when theme changes!
  const processedItems = useMemo(() => {
    console.log("💾 useMemo: Processing items (expensive operation)");
    const startTime = performance.now();

    let result = [...items];

    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter((item) => item.category === filterCategory);
    }

    // Sort by value
    result.sort((a, b) => {
      return sortOrder === "asc" ? a.value - b.value : b.value - a.value;
    });

    const endTime = performance.now();
    console.log(`💾 Processing took ${(endTime - startTime).toFixed(2)}ms`);

    return result;
  }, [items, sortOrder, filterCategory]);

  // ======================================
  // useCallback: Stabilize function reference
  // ======================================
  // Without useCallback, a new function would be created on every render,
  // breaking React.memo optimization for ListItem
  const handleDelete = useCallback((itemId) => {
    console.log(`🗑️ Deleting item ${itemId}`);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    setRenderCount((prev) => prev + 1);
  };

  const loadMoreItems = () => {
    const currentLength = items.length;
    const newItems = ITEMS.slice(currentLength, currentLength + 100);
    setItems((prev) => [...prev, ...newItems]);
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <h2>Exercise 2.1 & 2.2: Performance Optimization</h2>
      <p className="description">
        This component demonstrates <code>useMemo</code>,{" "}
        <code>React.memo</code>, and <code>useCallback</code>. Toggle the theme
        and watch the console - list items should NOT re-render when only theme
        changes!
      </p>

      {/* Performance Stats */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Theme:</span>
          <span className="stat-value">{theme}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Items:</span>
          <span className="stat-value">{processedItems.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Renders:</span>
          <span className="stat-value">{renderCount}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="asc">Sort: Low to High</option>
          <option value="desc">Sort: High to Low</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
          <option value="Sports">Sports</option>
        </select>

        <button onClick={loadMoreItems} className="load-btn">
          Load 100 More
        </button>
      </div>

      {/* List Header */}
      <div className="list-header">
        <span>ID</span>
        <span>Name</span>
        <span>Value</span>
        <span>Category</span>
        <span>Action</span>
      </div>

      {/* List Items */}
      <div className="list-container">
        {processedItems.slice(0, 50).map((item) => (
          <ListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
        {processedItems.length > 50 && (
          <p className="more-items">
            ... and {processedItems.length - 50} more items (showing first 50
            for performance)
          </p>
        )}
      </div>

      {/* Debug Info */}
      <div className="optimization-tips">
        <h4>🔍 Performance Tips</h4>
        <ul>
          <li>
            <code>useMemo</code>: Caches the sorted/filtered list - only
            recalculates when items, sortOrder, or filterCategory changes
          </li>
          <li>
            <code>React.memo</code>: ListItem only re-renders when its props
            change
          </li>
          <li>
            <code>useCallback</code>: handleDelete reference stays stable across
            renders
          </li>
          <li>Toggle theme and check console - ListItem should NOT log!</li>
        </ul>
      </div>
    </div>
  );
}
