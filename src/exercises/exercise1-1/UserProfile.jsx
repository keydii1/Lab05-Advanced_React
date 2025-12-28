import { useReducer, useEffect } from "react";
import "./UserProfile.css";

// ======================================
// EXERCISE 1.1: The Fetch Machine (useReducer)
// ======================================
// Context: useState is often insufficient for complex state logic where
// multiple sub-values change together or depend on previous states.
// This exercise implements a Finite State Machine pattern with useReducer.

// Define valid states for the Finite State Machine
const STATES = {
  IDLE: "idle",
  LOADING: "loading",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

// Define valid state transitions
// This prevents "impossible states" like loading=true AND error=true
const validTransitions = {
  [STATES.IDLE]: [STATES.LOADING],
  [STATES.LOADING]: [STATES.RESOLVED, STATES.REJECTED],
  [STATES.RESOLVED]: [STATES.LOADING],
  [STATES.REJECTED]: [STATES.LOADING],
};

// Initial state
const initialState = {
  status: STATES.IDLE,
  data: null,
  error: null,
};

// Action types
const ACTIONS = {
  FETCH_INIT: "FETCH_INIT",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
  RESET: "RESET",
};

// Reducer function with Finite State Machine pattern
// Prevents invalid state transitions
function fetchReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_INIT: {
      // Only allow transition to LOADING from valid states
      if (!validTransitions[state.status]?.includes(STATES.LOADING)) {
        console.warn(
          `Invalid transition: Cannot go from ${state.status} to ${STATES.LOADING}`
        );
        return state;
      }
      return {
        ...state,
        status: STATES.LOADING,
        error: null,
      };
    }

    case ACTIONS.FETCH_SUCCESS: {
      // Only allow success if currently loading
      if (state.status !== STATES.LOADING) {
        console.warn(
          `Invalid transition: Cannot go from ${state.status} to ${STATES.RESOLVED}`
        );
        return state;
      }
      return {
        status: STATES.RESOLVED,
        data: action.payload,
        error: null,
      };
    }

    case ACTIONS.FETCH_FAILURE: {
      // Only allow failure if currently loading
      if (state.status !== STATES.LOADING) {
        console.warn(
          `Invalid transition: Cannot go from ${state.status} to ${STATES.REJECTED}`
        );
        return state;
      }
      return {
        status: STATES.REJECTED,
        data: null,
        error: action.payload,
      };
    }

    case ACTIONS.RESET: {
      return initialState;
    }

    default:
      return state;
  }
}

// Mock API function to simulate fetching user data
async function fetchUserData(userId) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate random success/failure
  if (Math.random() > 0.3) {
    return {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Software Engineer",
      department: "Engineering",
    };
  } else {
    throw new Error("Failed to fetch user data. Please try again.");
  }
}

// UserProfile Component using useReducer with FSM pattern
export default function UserProfile({ userId = 1 }) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const handleFetch = async () => {
    dispatch({ type: ACTIONS.FETCH_INIT });

    try {
      const data = await fetchUserData(userId);
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_FAILURE, payload: error.message });
    }
  };

  const handleReset = () => {
    dispatch({ type: ACTIONS.RESET });
  };

  return (
    <div className="user-profile-container">
      <h2>Exercise 1.1: The Fetch Machine (useReducer)</h2>
      <p className="description">
        This component uses <code>useReducer</code> with a Finite State Machine
        pattern to manage complex state transitions.
      </p>

      {/* State Machine Visualization */}
      <div className="state-machine">
        <h3>Current State Machine Status</h3>
        <div className="states-grid">
          {Object.values(STATES).map((s) => (
            <div
              key={s}
              className={`state-box ${state.status === s ? "active" : ""}`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button
          onClick={handleFetch}
          disabled={state.status === STATES.LOADING}
          className="fetch-btn"
        >
          {state.status === STATES.LOADING ? "Fetching..." : "Fetch User"}
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>

      {/* Result Display */}
      <div className="result-container">
        {state.status === STATES.IDLE && (
          <p className="idle-message">Click "Fetch User" to load user data</p>
        )}

        {state.status === STATES.LOADING && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading user profile...</p>
          </div>
        )}

        {state.status === STATES.RESOLVED && state.data && (
          <div className="user-card">
            <img
              src={state.data.avatar}
              alt={state.data.name}
              className="avatar"
            />
            <div className="user-info">
              <h3>{state.data.name}</h3>
              <p className="email">{state.data.email}</p>
              <p className="role">{state.data.role}</p>
              <p className="department">{state.data.department}</p>
            </div>
          </div>
        )}

        {state.status === STATES.REJECTED && (
          <div className="error">
            <span className="error-icon">⚠️</span>
            <p>{state.error}</p>
            <button onClick={handleFetch} className="retry-btn">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <h4>Debug: Current State</h4>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}
