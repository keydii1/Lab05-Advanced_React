import { useState } from "react";
import { Provider } from "react-redux";
import store from "./store/store";

// Exercise Components
import UserProfile from "./exercises/exercise1-1/UserProfile";
import ShoppingCart from "./exercises/exercise1-2/ShoppingCart";
import Dashboard from "./exercises/exercise2-1/Dashboard";
import AdminPanel from "./exercises/exercise2-3/AdminPanel";
import TabsDemo from "./exercises/exercise3-1/Tabs";
import ModalDemo from "./exercises/exercise3-2/Modal";
import LoginForm from "./exercises/exercise4-1/LoginForm";
import ErrorBoundaryDemo from "./exercises/exercise4-2/ErrorBoundaryDemo";

import "./App.css";

const exercises = [
  {
    id: "1.1",
    title: "The Fetch Machine (useReducer)",
    component: UserProfile,
    category: "Part 1: Complex State Management",
  },
  {
    id: "1.2",
    title: "The Global Store (Redux Toolkit)",
    component: ShoppingCart,
    category: "Part 1: Complex State Management",
    needsRedux: true,
  },
  {
    id: "2.1",
    title: "The Laggy List (useMemo & React.memo)",
    component: Dashboard,
    category: "Part 2: Performance Engineering",
  },
  {
    id: "2.3",
    title: "Route-Based Code Splitting",
    component: AdminPanel,
    category: "Part 2: Performance Engineering",
  },
  {
    id: "3.1",
    title: "The Compound Tabs Component",
    component: TabsDemo,
    category: "Part 3: Advanced Design Patterns",
  },
  {
    id: "3.2",
    title: 'The "Trapdoor" Modal (Portals)',
    component: ModalDemo,
    category: "Part 3: Advanced Design Patterns",
  },
  {
    id: "4.1",
    title: "Integration Testing a Form",
    component: LoginForm,
    category: "Part 4: Testing Strategies",
  },
  {
    id: "4.2",
    title: "Testing Error Boundaries",
    component: ErrorBoundaryDemo,
    category: "Part 4: Testing Strategies",
  },
];

function App() {
  const [activeExercise, setActiveExercise] = useState(exercises[0]);

  // Group exercises by category
  const categories = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push(exercise);
    return acc;
  }, {});

  const ActiveComponent = activeExercise.component;

  const renderActiveComponent = () => {
    if (activeExercise.needsRedux) {
      return (
        <Provider store={store}>
          <ActiveComponent />
        </Provider>
      );
    }
    return <ActiveComponent />;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>⚛️ Lab 5: React Advanced</h1>
        <p>Practical Exercises</p>
      </header>

      <div className="app-layout">
        {/* Sidebar Navigation */}
        <nav className="sidebar" aria-label="Exercise Navigation">
          {Object.entries(categories).map(([category, categoryExercises]) => (
            <div key={category} className="nav-category">
              <h3>{category}</h3>
              <ul>
                {categoryExercises.map((exercise) => (
                  <li key={exercise.id}>
                    <button
                      className={
                        activeExercise.id === exercise.id ? "active" : ""
                      }
                      onClick={() => setActiveExercise(exercise)}
                      aria-current={
                        activeExercise.id === exercise.id ? "page" : undefined
                      }
                    >
                      <span className="exercise-id">{exercise.id}</span>
                      <span className="exercise-title">{exercise.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Main Content */}
        <main className="main-content">{renderActiveComponent()}</main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} React Advanced Lab | Built with React &
          Vite
        </p>
      </footer>
    </div>
  );
}

export default App;
