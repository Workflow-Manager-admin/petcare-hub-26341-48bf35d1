import React, { useState } from 'react';
import './App.css';
import { PetCareProvider } from './PetCareContext';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import PetProfiles from './components/PetProfiles';
import TaskScheduler from './components/TaskScheduler';
import HealthLog from './components/HealthLog';
import Settings from './components/Settings';

/**
 * App Container for PetCare Hub.
 * Handles navigation and renders the appropriate main feature screen.
 */
function App() {
  const [navKey, setNavKey] = useState("dashboard");

  // PUBLIC_INTERFACE
  /** Handles click on nav buttons. */
  const handleNavigate = (key) => {
    setNavKey(key);
  };

  // Renders the main content area based on selected navigation
  const renderMain = () => {
    switch (navKey) {
      case "dashboard":
        return <Dashboard />;
      case "profiles":
        return <PetProfiles />;
      case "tasks":
        return <TaskScheduler />;
      case "health":
        return <HealthLog />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
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
                PetCareHub
              </button>
            </div>
          </div>
        </nav>

        <main>
          <div className="container" style={{ paddingTop: "calc(var(--navbar-height) + 25px)" }}>
            {renderMain()}
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