import React, { createContext, useContext, useState } from "react";

/**
 * Centralized state provider for PetCare Hub application.
 * Contains all pet profiles, care tasks, health logs, and reminders state.
 */

// Initial structures for data, easily expandable in the future.
const PetCareContext = createContext();

// PUBLIC_INTERFACE
export function PetCareProvider({ children }) {
  // Pets: [{ id, name, species, breed, age, notes, photo }]
  const [pets, setPets] = useState([]);

  // Tasks: [{ id, petId, description, frequency, times, completed, date }]
  const [tasks, setTasks] = useState([]);

  // Health Logs: [{ id, petId, eventType, description, date, attachments }]
  const [healthLogs, setHealthLogs] = useState([]);

  // Reminders: [{ id, petId, type, message, dueDate, status }]
  const [reminders, setReminders] = useState([]);

  // Context value contains full state and setters for convenience
  const value = {
    pets, setPets,
    tasks, setTasks,
    healthLogs, setHealthLogs,
    reminders, setReminders,
  };

  return (
    <PetCareContext.Provider value={value}>
      {children}
    </PetCareContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Hook for easy access to PetCare Hub app state.
 * @returns {{pets, setPets, tasks, setTasks, healthLogs, setHealthLogs, reminders, setReminders}}
 */
export function usePetCare() {
  const context = useContext(PetCareContext);
  if (context === undefined) {
    throw new Error("usePetCare must be used within a PetCareProvider");
  }
  return context;
}
