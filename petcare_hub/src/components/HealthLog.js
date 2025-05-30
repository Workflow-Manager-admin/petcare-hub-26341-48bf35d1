import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * HealthLog component for PetCare Hub.
 * Shows logged health events (vet visits, meds, vaccinations) for each pet, filterable by pet.
 */
// PUBLIC_INTERFACE
function HealthLog() {
  const { pets, healthLogs } = usePetCare();

  return (
    <section aria-label="Health Log" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 18, fontWeight: 600 }}>
        Health Log
      </h2>
      {pets.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "22px 0" }}>
          Add a pet profile to begin logging health events.
        </div>
      ) : (
        pets.map((pet) => {
          const petLogs = healthLogs.filter((h) => h.petId === pet.id);
          return (
            <div
              key={pet.id}
              style={{
                marginBottom: 24,
                background: "#FAFAFA",
                borderRadius: 9,
                boxShadow: "var(--shadow)",
                padding: "13px 17px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 17 }}>{pet.name}</div>
              {petLogs.length === 0 ? (
                <div style={{ fontSize: 13, color: "#bbb" }}>
                  No health logs. Click "Log Event" to add one.
                </div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 12 }}>
                  {petLogs.map((log) => (
                    <li key={log.id} style={{ marginBottom: 7 }}>
                      <span style={{ fontWeight: 500 }}>{log.eventType || "Health Event"}</span>:{" "}
                      <span>{log.description}</span>{" "}
                      <span style={{ color: "#888", fontSize: 12 }}>
                        {log.date ? `on ${log.date}` : ""}
                      </span>
                      {/* Attachments UI can be implemented */}
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="btn"
                style={{ marginTop: 9, fontSize: 14 }}
                aria-label={`Log health event for ${pet.name}`}
                // To be implemented: open health log form/modal for this pet
              >
                Log Event
              </button>
            </div>
          );
        })
      )}
    </section>
  );
}

export default HealthLog;
