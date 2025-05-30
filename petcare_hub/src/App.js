import React, { useState } from 'react';
import './App.css';
import { PetCareProvider } from './PetCareContext';
import BottomNav from './components/BottomNav';

/**
 * App Container for PetCare Hub.
 * Main navigation now persists at the bottom for easy access to major features.
 */
function App() {
  // In a full implementation, this would be driven by routing or state.
  const [navKey, setNavKey] = useState("dashboard");

  /** Handles click on nav buttons. In a real app, integrate with router or navigator here. */
  const handleNavigate = (key) => {
    setNavKey(key); // Temporary: component state change only
  };

  return (
    <PetCareProvider>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> KAVIA AI
              </div>
              <button className="btn" tabIndex={-1} style={{ pointerEvents: "none", opacity: 0.7 }}>
                Template Button
              </button>
            </div>
          </div>
        </nav>

        <main>
          <div className="container">
            <div className="hero">
              {/* Content below will be replaced by real feature screens */}
              <div className="subtitle">
                {navKey === "dashboard"
                  ? "Daily Task Dashboard"
                  : navKey === "profiles"
                  ? "Manage Pet Profiles"
                  : navKey === "tasks"
                  ? "Task Scheduler"
                  : navKey === "health"
                  ? "Health Log"
                  : navKey === "settings"
                  ? "Settings"
                  : "AI Workflow Manager Template"}
              </div>
              
              <h1 className="title">petcare_hub</h1>
              
              <div className="description">
                {navKey === "dashboard"
                  ? "View and manage today’s scheduled care tasks for all your pets."
                  : navKey === "profiles"
                  ? "View, add, and update individual pet profiles."
                  : navKey === "tasks"
                  ? "Schedule and review recurring care tasks, walks, and feeding."
                  : navKey === "health"
                  ? "Log and examine pet health events, vet visits, or vaccinations."
                  : navKey === "settings"
                  ? "Adjust reminders and application preferences."
                  : "Start building your application."}
              </div>
              
              <button className="btn btn-large">Button</button>
            </div>
          </div>
        </main>
        {/* Persistent, always-visible bottom nav bar */}
        <BottomNav selectedKey={navKey} onNavigate={handleNavigate} />
        {/* Optional: spacing for below content */}
        <div className="bottom-nav-space" aria-hidden="true" />
      </div>
    </PetCareProvider>
  );
}

export default App;