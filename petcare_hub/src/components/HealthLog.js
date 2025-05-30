import React, { useState } from "react";
import { usePetCare } from "../PetCareContext";

/**
 * HealthLog component for PetCare Hub.
 * Shows logged health events for each pet, and lets users add new health events.
 */
// PUBLIC_INTERFACE
function HealthLog() {
  const { pets, healthLogs, setHealthLogs } = usePetCare();

  // Form state
  const [showForm, setShowForm] = useState(false); // global form, or controlled by pet
  const [form, setForm] = useState({
    petId: "",
    eventType: "",
    date: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [formForPetId, setFormForPetId] = useState(null); // If "Add Event" button under a pet clicked

  // Event type options
  const EVENT_TYPE_OPTIONS = [
    { value: "vet visit", label: "Vet Visit" },
    { value: "vaccination", label: "Vaccination" },
    { value: "medication", label: "Medication" },
    { value: "other", label: "Other" },
  ];

  // Unique health event ID generator
  const genHealthEventId = () =>
    "health_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Handler for form value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
    setFormError("");
  };

  // Handler to display the form, optionally preselecting pet
  const handleShowForm = (petId) => {
    setFormForPetId(petId || null);
    setForm({
      petId: petId || "",
      eventType: "",
      date: "",
      notes: "",
    });
    setShowForm(true);
    setFormError("");
  };

  // Handler for cancel/add form
  const handleCancelForm = () => {
    setShowForm(false);
    setFormForPetId(null);
    setForm({
      petId: "",
      eventType: "",
      date: "",
      notes: "",
    });
    setFormError("");
  };

  // Handler for form submit (add health event)
  const handleAddHealthEvent = (e) => {
    e.preventDefault();
    if (!form.petId) {
      setFormError("Select a pet.");
      return;
    }
    if (!form.eventType) {
      setFormError("Choose an event type.");
      return;
    }
    if (!form.date) {
      setFormError("Please provide a date.");
      return;
    }
    // Notes can be optional
    setHealthLogs((prev) => [
      ...prev,
      {
        id: genHealthEventId(),
        petId: form.petId,
        eventType: form.eventType,
        description: form.notes.trim(),
        date: form.date,
        // attachments: undefined, // Out of scope for now
      },
    ]);
    setShowForm(false);
    setFormForPetId(null);
    setForm({
      petId: "",
      eventType: "",
      date: "",
      notes: "",
    });
    setFormError("");
  };

  // Renders the add-event form (overlays list/head, displays at top or under relevant pet section)
  function renderHealthLogForm() {
    return (
      <form
        aria-label="Add Health Event"
        onSubmit={handleAddHealthEvent}
        style={{
          background: "#fafafa",
          borderRadius: 9,
          marginBottom: 25,
          marginTop: 12,
          padding: "18px 17px 10px 17px",
          boxShadow: "var(--shadow)",
          maxWidth: 430,
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--primary)", fontSize: 16, marginBottom: 10 }}>
          Add Health Event
        </div>
        {/* Pet selector */}
        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Pet*
          <select
            name="petId"
            value={form.petId}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginTop: 3,
              marginBottom: 12,
              padding: "8px 7px",
              borderRadius: 7,
              border: "1.2px solid #e0e0e0",
              fontSize: 15,
            }}
            aria-label="Select Pet"
            disabled={!!formForPetId}
          >
            <option value="">Select a pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name ? `${pet.name} (${pet.species})` : pet.id}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Event Type*
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginTop: 3,
              marginBottom: 12,
              padding: "8px 7px",
              borderRadius: 7,
              border: "1.2px solid #e0e0e0",
              fontSize: 15,
            }}
            aria-label="Select Event Type"
          >
            <option value="">Choose type</option>
            {EVENT_TYPE_OPTIONS.map((evt) => (
              <option key={evt.value} value={evt.value}>
                {evt.label}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Date*
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginTop: 3,
              marginBottom: 12,
              padding: "8px 7px",
              borderRadius: 7,
              border: "1.2px solid #e0e0e0",
              fontSize: 15,
            }}
            aria-label="Health Event Date"
            max={new Date().toISOString().slice(0, 10)}
          />
        </label>
        <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            style={{
              width: "100%",
              marginTop: 3,
              marginBottom: 6,
              padding: "8px 7px",
              borderRadius: 7,
              border: "1.2px solid #e0e0e0",
              fontSize: 15,
              resize: "vertical",
            }}
            placeholder="Any extra info (optional)"
            aria-label="Notes"
          />
        </label>
        {/* Error if any */}
        {formError && (
          <div
            role="alert"
            style={{
              color: "#d23f21",
              fontSize: 14,
              marginBottom: 7,
              fontWeight: 500,
            }}
          >
            {formError}
          </div>
        )}
        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button
            type="submit"
            className="btn btn-large"
            aria-label="Save health event"
            style={{ background: "var(--primary)" }}
          >
            Save Event
          </button>
          <button
            type="button"
            className="btn"
            aria-label="Cancel add health event"
            style={{
              background: "transparent",
              color: "var(--primary)",
              borderColor: "#e0e0e0",
            }}
            onClick={handleCancelForm}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

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
        <>
          {/* Render top-level "Add Health Event" button */}
          {!showForm && (
            <button
              className="btn btn-large"
              style={{ marginBottom: 23 }}
              aria-label="Add Health Event"
              onClick={() => handleShowForm()}
            >
              Add Health Event
            </button>
          )}
          {/* Render the form at the top if not adding for a specific pet */}
          {showForm && !formForPetId && renderHealthLogForm()}

          {/* List pets and their health logs */}
          {pets.map((pet) => {
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
                    No health events recorded for this pet.
                  </div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 12 }}>
                    {petLogs
                      .sort((a, b) => (a.date > b.date ? -1 : 1))
                      .map((log) => (
                        <li key={log.id} style={{ marginBottom: 7 }}>
                          <span style={{ fontWeight: 500 }}>{log.eventType || "Health Event"}</span>:{" "}
                          <span>{log.description}</span>{" "}
                          <span style={{ color: "#888", fontSize: 12 }}>
                            {log.date ? `on ${log.date}` : ""}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
                {/* Per-pet "Add Event" button */}
                {!showForm && (
                  <button
                    className="btn"
                    style={{ marginTop: 9, fontSize: 14 }}
                    aria-label={`Log health event for ${pet.name}`}
                    onClick={() => handleShowForm(pet.id)}
                  >
                    Add Event
                  </button>
                )}
                {/* Inline form for this pet if dialog triggered for it */}
                {showForm && formForPetId === pet.id && renderHealthLogForm()}
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}

export default HealthLog;
