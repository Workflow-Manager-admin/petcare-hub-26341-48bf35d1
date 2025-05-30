import React from "react";
import "./BottomNav.css";

// PUBLIC_INTERFACE
/**
 * Bottom navigation bar for PetCare Hub.
 * Shows main app destinations: Dashboard, Pet Profiles, Task Scheduler, Health Log, Settings.
 * Always docked to bottom, mobile-friendly, styled with app palette.
 */
function BottomNav({ selectedKey = "dashboard", onNavigate }) {
  // Map nav items to icon/label pairs
  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: (
        // Dashboard icon: home
        <svg width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 22">
          <path d="M3 10L11 4l8 6v8a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 1-2-2V10z"/>
        </svg>
      ),
    },
    {
      key: "profiles",
      label: "Pet Profiles",
      icon: (
        // Pet profile icon: user/group/paw
        <svg width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 22">
          <circle cx="11" cy="8" r="4" />
          <path d="M4 20v-1a6 6 0 0 1 12 0v1" />
        </svg>
      ),
    },
    {
      key: "tasks",
      label: "Task Scheduler",
      icon: (
        // Calendar/checklist icon
        <svg width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 22">
          <rect x="3" y="5" width="16" height="14" rx="3" />
          <path d="M16 3v4M6 3v4M3 9h16"/>
        </svg>
      ),
    },
    {
      key: "health",
      label: "Health Log",
      icon: (
        // Heart/pulse icon
        <svg width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 22">
          <path d="M16.3 3.7a5 5 0 0 1 0 7.1l-5.3 5.2-5.2-5.2A5 5 0 1 1 16.3 3.7z"/>
        </svg>
      ),
    },
    {
      key: "settings",
      label: "Settings",
      icon: (
        // Settings/gear icon
        <svg width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="3" />
          <path d="M19.4 13A7.03 7.03 0 0 0 21 11c0-.7-.1-1.4-.3-2l-1.7-.3a6.77 6.77 0 0 0-1.1-2l.9-1.5A6.91 6.91 0 0 0 16 3.8l-1.5.9a6.77 6.77 0 0 0-2-1.1L12 2.3C11.4 2.1 10.7 2 10 2c-.7 0-1.4.1-2 .3l-.3 1.7a6.77 6.77 0 0 0-2 1.1L4.2 4.2A6.91 6.91 0 0 0 3.8 6l.9 1.5a6.77 6.77 0 0 0-1.1 2L2.3 10c-.2.6-.3 1.3-.3 2 0 .7.1 1.4.3 2l1.7.3a6.77 6.77 0 0 0 1.1 2l-.9 1.5a6.91 6.91 0 0 0 1.4 1.2l1.5-.9a6.77 6.77 0 0 0 2 1.1l.3 1.7c.6.2 1.3.3 2 .3.7 0 1.4-.1 2-.3l.3-1.7a6.77 6.77 0 0 0 2-1.1l1.5.9a6.91 6.91 0 0 0 1.2-1.4l-.9-1.5a6.77 6.77 0 0 0 1.1-2l1.7-.3z"/>
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main app navigation">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`bottom-nav__item${selectedKey === item.key ? " bottom-nav__item--active" : ""}`}
          aria-label={item.label}
          aria-current={selectedKey === item.key ? "page" : undefined}
          onClick={() => (onNavigate ? onNavigate(item.key) : null)}
          tabIndex={0}
        >
          <span className="bottom-nav__icon">{item.icon}</span>
          <span className="bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
