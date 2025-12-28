import { useState } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

// ======================================
// EXERCISE 3.2: The "Trapdoor" Modal (Portals)
// ======================================
// Context: createPortal lets you render a child component into a DOM node
// that exists outside the DOM hierarchy of the parent. This is essential
// for modals to avoid CSS clipping issues (e.g., overflow: hidden).

// ======================================
// Modal Component using createPortal
// ======================================
function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  // Render modal into document.body (or #modal-root if exists)
  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    modalRoot
  );
}

// ======================================
// Card with overflow:hidden (the problem scenario)
// ======================================
function Card({ children, onClick }) {
  return (
    <div className="clipped-card" onClick={onClick}>
      {children}
    </div>
  );
}

// ======================================
// Demo Component
// ======================================
export default function ModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventLog, setEventLog] = useState([]);

  // Event handler to demonstrate event bubbling
  const handleParentClick = (e) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [
      `[${timestamp}] Parent div clicked! (Event bubbling works!)`,
      ...prev.slice(0, 4),
    ]);
  };

  const handleModalButtonClick = () => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [
      `[${timestamp}] Button inside Portal clicked!`,
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="modal-demo-container">
      <h2>Exercise 3.2: The "Trapdoor" Modal (Portals)</h2>
      <p className="description">
        This component uses <code>createPortal</code> to render a modal outside
        the parent DOM hierarchy, escaping CSS clipping while maintaining
        React's synthetic event bubbling.
      </p>

      {/* Demo Section */}
      <div className="demo-section">
        <div className="demo-layout">
          {/* Problem Demonstration */}
          <div className="problem-demo">
            <h3>🚫 Without Portal (Problem)</h3>
            <Card>
              <p>
                This card has <code>overflow: hidden</code>. Any popup or modal
                rendered inside would be clipped!
              </p>
              <div className="fake-popup">I'm clipped! 😢</div>
            </Card>
          </div>

          {/* Solution Demonstration */}
          <div className="solution-demo" onClick={handleParentClick}>
            <h3>✅ With Portal (Solution)</h3>
            <Card>
              <p>Click the button to open a modal that escapes the overflow!</p>
              <button
                className="open-modal-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                Open Modal
              </button>
            </Card>

            {/* Modal rendered via Portal */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Portal Modal"
            >
              <p>
                🎉 This modal is rendered using <code>createPortal</code>! It
                appears outside the parent's DOM hierarchy, so it's not affected
                by <code>overflow: hidden</code>.
              </p>
              <p>
                <strong>Event Bubbling Challenge:</strong> Click the button
                below. Even though this modal is rendered in{" "}
                <code>document.body</code>, React's synthetic events still
                bubble up to the parent component!
              </p>
              <button className="portal-btn" onClick={handleModalButtonClick}>
                Click me to test Event Bubbling
              </button>
            </Modal>
          </div>
        </div>

        {/* Event Log */}
        <div className="event-log">
          <h4>📋 Event Log</h4>
          {eventLog.length === 0 ? (
            <p className="no-events">
              Click the portal button to see events...
            </p>
          ) : (
            <ul>
              {eventLog.map((log, i) => (
                <li key={i} className="event-item">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Portal Explanation */}
      <div className="portal-explanation">
        <h4>💡 How Portals Work</h4>
        <div className="explanation-grid">
          <div className="explanation-item">
            <span className="icon">🚪</span>
            <h5>Escapes DOM Hierarchy</h5>
            <p>
              Modal is rendered in <code>document.body</code>, not inside the
              parent with <code>overflow: hidden</code>
            </p>
          </div>
          <div className="explanation-item">
            <span className="icon">🔗</span>
            <h5>Maintains React Tree</h5>
            <p>
              Despite being in a different DOM location, the modal is still part
              of React's component tree
            </p>
          </div>
          <div className="explanation-item">
            <span className="icon">⬆️</span>
            <h5>Event Bubbling</h5>
            <p>
              Synthetic events bubble through React's tree, not the DOM tree -
              parent handlers still work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Modal for reuse
export { Modal };
