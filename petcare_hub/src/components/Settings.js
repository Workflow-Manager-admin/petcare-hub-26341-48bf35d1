import React, { useState, useRef, useEffect } from "react";
import { usePetCare } from "../PetCareContext";

/**
 * Settings component for PetCare Hub.
 * Provides the UI to manage in-app Reminders (add, view, delete).
 * Reminders are linked to a pet or general task, and stored in PetCareContext.
 */
 // PUBLIC_INTERFACE
function Settings() {
  const { reminders, setReminders, pets, tasks } = usePetCare();

  // Form state for new reminder
  const initialForm = {
    title: "",
    petOrTask: "", // will store either petId or taskId, or "" (none/general)
    type: "pet",   // "pet" or "task"
    dueDateTime: "",
    notes: "",
  };
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");

  // Handler for form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
    setFormError("");
  };

  // Unique Reminder ID generator
  const genReminderId = () =>
    "rem_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // PUBLIC_INTERFACE
  /** Handles add reminder form submission, with validation and update of PetCareContext */
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Reminder title is required.");
      return;
    }
    if (form.type === "pet" && !form.petOrTask) {
      setFormError("Select a pet for this reminder, or choose 'Task' to link a task.");
      return;
    }
    if (form.type === "task" && !form.petOrTask) {
      setFormError("Select a task for this reminder.");
      return;
    }
    if (!form.dueDateTime) {
      setFormError("Please select a date and time.");
      return;
    }
    // Reminder object structure
    setReminders((old) => [
      ...old,
      {
        id: genReminderId(),
        petId: form.type === "pet" ? form.petOrTask : null,
        taskId: form.type === "task" ? form.petOrTask : null,
        type: form.type,
        title: form.title.trim(),
        dueDate: form.dueDateTime,
        notes: form.notes.trim(),
      },
    ]);
    setForm(initialForm);
    setFormError("");
  };

  // PUBLIC_INTERFACE
  /** Handles deletion of a reminder by id */
  const handleDeleteReminder = (reminderId) => {
    if (window.confirm("Delete this reminder?")) {
      setReminders((old) => old.filter((rem) => rem.id !== reminderId));
    }
  };

  // For selection: show pets and tasks
  const petOptions = pets || [];
  const taskOptions = tasks || [];

  // Sort reminders by dueDate
  const sortedReminders = (reminders || []).slice().sort((a, b) =>
    (a.dueDate || "") > (b.dueDate || "") ? 1 : -1
  );

  return (
    <section aria-label="Settings" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 18, fontWeight: 600 }}>
        Settings
      </h2>
      <div
        style={{
          background: "#FAFAFA",
          borderRadius: 9,
          boxShadow: "var(--shadow)",
          padding: "17px 18px",
          marginBottom: 30,
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 10 }}>
          Reminders &amp; Alert Preferences
        </div>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 13 }}>
          Manage reminders for important events (medications, vet visits, etc.).<br />
          Associate reminders to a pet or a specific scheduled task.
        </div>

        {/* Form for adding a new reminder */}
        <form
          onSubmit={handleAddReminder}
          style={{
            background: "#fff",
            borderRadius: 7,
            padding: "18px 13px",
            marginBottom: reminders && reminders.length ? 14 : 0,
            boxShadow: "0 1px 6px rgba(76,175,80,0.06)",
            maxWidth: 440,
          }}
          aria-label="Add Reminder Form"
        >
          <div
            style={{
              color: "var(--primary)",
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Add Reminder
          </div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            Title*
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                marginTop: 3,
                marginBottom: 10,
                padding: "8px 7px",
                borderRadius: 7,
                border: "1.2px solid #e0e0e0",
                fontSize: 15,
              }}
              placeholder="Reminder title"
              aria-label="Reminder Title"
            />
          </label>
          <label
            style={{
              fontWeight: 600,
              display: "block",
              marginBottom: 3,
              marginTop: 3,
            }}
          >
            Link To*
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <label
                style={{
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="pet"
                  checked={form.type === "pet"}
                  onChange={handleInputChange}
                  style={{ marginRight: 5 }}
                  aria-label="Reminder for Pet"
                />
                Pet
              </label>
              <label
                style={{
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value="task"
                  checked={form.type === "task"}
                  onChange={handleInputChange}
                  style={{ marginRight: 5, marginLeft: 10 }}
                  aria-label="Reminder for Task"
                />
                Task
              </label>
            </div>
            {form.type === "pet" ? (
              <select
                name="petOrTask"
                value={form.type === "pet" ? form.petOrTask : ""}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  marginBottom: 10,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                }}
                aria-label="Select Pet for Reminder"
              >
                <option value="">Select a pet</option>
                {petOptions.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name ? `${pet.name} (${pet.species})` : pet.id}
                  </option>
                ))}
              </select>
            ) : (
              <select
                name="petOrTask"
                value={form.type === "task" ? form.petOrTask : ""}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  marginBottom: 10,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                }}
                aria-label="Select Task for Reminder"
              >
                <option value="">Select a task</option>
                {taskOptions.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.description || task.id}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
            Date &amp; Time*
            <input
              type="datetime-local"
              name="dueDateTime"
              value={form.dueDateTime}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                marginTop: 3,
                marginBottom: 10,
                padding: "8px 7px",
                borderRadius: 7,
                border: "1.2px solid #e0e0e0",
                fontSize: 15,
              }}
              aria-label="Reminder Date and Time"
            />
          </label>
          <label style={{ fontWeight: 500, display: "block", marginBottom: 5 }}>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleInputChange}
              rows={2}
              style={{
                width: "100%",
                marginTop: 3,
                marginBottom: 5,
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
          {formError && (
            <div
              role="alert"
              style={{
                color: "#d23f21",
                fontSize: 14,
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              {formError}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-large"
            style={{ marginTop: 4 }}
            aria-label="Save Reminder"
          >
            Save Reminder
          </button>
        </form>
      </div>
      {/* Render reminder list */}
      <div
        style={{
          background: "#FAFAFA",
          borderRadius: 9,
          boxShadow: "var(--shadow)",
          padding: "17px 18px",
          maxWidth: 650,
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 8 }}>
          Current Reminders
        </div>
        {!reminders || reminders.length === 0 ? (
          <div style={{ color: "#888", fontSize: 13 }}>
            No reminders set yet.
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {sortedReminders.map((rem) => {
              let relatedName = "";
              if (rem.type === "pet" && rem.petId) {
                const pet = petOptions.find((p) => p.id === rem.petId);
                relatedName = pet
                  ? `Pet: ${pet.name}${pet.species ? " (" + pet.species + ")" : ""}`
                  : `Pet (ID: ${rem.petId})`;
              }
              if (rem.type === "task" && rem.taskId) {
                const task = taskOptions.find((t) => t.id === rem.taskId);
                relatedName = task
                  ? `Task: ${task.description}`
                  : `Task (ID: ${rem.taskId})`;
              }
              return (
                <li
                  key={rem.id}
                  style={{
                    marginBottom: 14,
                    background: "#fff",
                    borderRadius: 7,
                    boxShadow: "0 1px 5px rgba(76,175,80,0.05)",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    position: "relative"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{rem.title}</div>
                    {relatedName && (
                      <div style={{ fontSize: 13, color: "#444" }}>
                        {relatedName}
                      </div>
                    )}
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {rem.dueDate
                        ? (() => {
                            // format as "YYYY-MM-DD HH:mm"
                            const d = new Date(rem.dueDate);
                            if (isNaN(d.getTime())) {
                              return rem.dueDate;
                            }
                            return (
                              d.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }) +
                              " " +
                              d
                                .toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                .replace(/:\d+ /, " ")
                            );
                          })()
                        : ""}
                    </div>
                    {rem.notes && (
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                        {rem.notes}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn"
                    aria-label={`Delete reminder "${rem.title}"`}
                    title="Delete reminder"
                    style={{
                      background: "var(--kavia-orange)",
                      color: "#fff",
                      borderRadius: 7,
                      fontSize: 13,
                      padding: "5px 14px",
                      minWidth: 0,
                      fontWeight: 600,
                      border: "none"
                    }}
                    onClick={() => handleDeleteReminder(rem.id)}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Settings;
