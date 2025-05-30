import React, { useState, useRef, useEffect } from "react";
import { usePetCare } from "../PetCareContext";

/**
 * Settings component for PetCare Hub.
 * Provides the UI to manage in-app Reminders (add, view, delete).
 * Reminders are linked to a pet or general task, and stored in PetCareContext.
 *
 * Now includes: Simulated in-app notifications for reminders due within the next hour.
 */
// PUBLIC_INTERFACE
function Settings() {
  const { reminders, setReminders, pets, tasks } = usePetCare();

  // Form state for reminder add/edit
  const initialForm = {
    title: "",
    petOrTask: "", // either petId or taskId or "" for general
    type: "pet",   // pet or task
    dueDateTime: "",
    notes: "",
  };
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // For simulated notification pop-up
  const [inAppAlert, setInAppAlert] = useState(null);

  // Handler for input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
    setFormError("");
  };

  // Generates a unique reminder ID
  const genReminderId = () =>
    "rem_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // PUBLIC_INTERFACE
  // Add or update reminder (handles both add and edit)
  const handleAddOrEditReminder = (e) => {
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
    if (editId) {
      // Edit mode: update existing reminder by ID
      setReminders((old) =>
        old.map((rem) =>
          rem.id === editId
            ? {
                ...rem,
                petId: form.type === "pet" ? form.petOrTask : null,
                taskId: form.type === "task" ? form.petOrTask : null,
                type: form.type,
                title: form.title.trim(),
                dueDate: form.dueDateTime,
                notes: form.notes.trim(),
              }
            : rem
        )
      );
    } else {
      // Add mode
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
    }
    setForm(initialForm);
    setFormError("");
    setEditId(null);
    setShowForm(false);
  };

  // PUBLIC_INTERFACE
  const handleDeleteReminder = (reminderId) => {
    if (window.confirm("Delete this reminder?")) {
      setReminders((old) => old.filter((rem) => rem.id !== reminderId));
    }
  };

  // PUBLIC_INTERFACE
  const handleEditReminder = (rem) => {
    setForm({
      title: rem.title || "",
      petOrTask: rem.type === "pet" ? rem.petId || "" : rem.taskId || "",
      type: rem.type,
      dueDateTime: rem.dueDate || "",
      notes: rem.notes || "",
    });
    setEditId(rem.id);
    setShowForm(true);
    setFormError("");
  };

  // PUBLIC_INTERFACE
  const handleCancelForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
    setFormError("");
  };

  // For selection: show pets and tasks
  const petOptions = pets || [];
  const taskOptions = tasks || [];
  // Sort reminders by dueDate
  const sortedReminders = (reminders || []).slice().sort((a, b) =>
    (a.dueDate || "") > (b.dueDate || "") ? 1 : -1
  );

  // Simulate in-app notifications: detect if a reminder is within the next hour
  const now = new Date();
  const soonThresholdMs = 60 * 60 * 1000; // 1 hour
  function getSoonReminders() {
    return sortedReminders.filter(rem => {
      if (!rem.dueDate) return false;
      const due = new Date(rem.dueDate);
      return due - now > 0 && due - now <= soonThresholdMs;
    });
  }
  const soonReminders = getSoonReminders();

  // In-app notification simulation (shows only once per page load for due reminders in the next hour)
  useEffect(() => {
    if (soonReminders.length > 0) {
      // Set a notification that auto-dismisses after 6 seconds
      setInAppAlert({
        msg: `⏰ Reminder: "${soonReminders[0].title}" is due soon!`,
        id: soonReminders[0].id,
      });
      const timeout = setTimeout(() => {
        setInAppAlert(null);
      }, 6000);
      return () => clearTimeout(timeout);
    } else {
      setInAppAlert(null);
    }
    // eslint-disable-next-line
  }, [soonReminders.length]);

  // Alert close handler
  const closeInAppAlert = () => setInAppAlert(null);

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
        {/* Add button visible only when not editing/adding */}
        {!showForm && (
          <button
            className="btn btn-large"
            aria-label="Add Reminder"
            onClick={() => {
              setForm(initialForm);
              setEditId(null);
              setShowForm(true);
              setFormError("");
            }}
            style={{ marginBottom: 18, marginTop: 2 }}
          >
            Add Reminder
          </button>
        )}
        {/* Single, shared form for Add/Edit */}
        {showForm && (
          <form
            onSubmit={handleAddOrEditReminder}
            style={{
              background: "#fff",
              borderRadius: 7,
              padding: "18px 13px",
              marginBottom: 18,
              boxShadow: "0 1px 6px rgba(76,175,80,0.06)",
              maxWidth: 440,
            }}
            aria-label={editId ? "Edit Reminder Form" : "Add Reminder Form"}
          >
            <div
              style={{
                color: "var(--primary)",
                marginBottom: 8,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {editId ? "Edit Reminder" : "Add Reminder"}
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
                autoFocus
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
            <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
              <button
                type="submit"
                className="btn btn-large"
                style={{ marginTop: 2, background: "var(--primary)" }}
                aria-label={editId ? "Save Changes" : "Save Reminder"}
              >
                {editId ? "Save Changes" : "Save Reminder"}
              </button>
              <button
                type="button"
                className="btn"
                aria-label="Cancel Add/Edit Reminder"
                style={{ background: "transparent", color: "var(--primary)", borderColor: "#e0e0e0" }}
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {soonReminders.length > 0 && (
          <div
            style={{
              color: "var(--accent)",
              background: "#FFF3E0",
              borderLeft: "5px solid var(--accent)",
              padding: "8px 13px",
              borderRadius: 7,
              fontWeight: 600,
              marginBottom: 7,
              marginTop: showForm ? 8 : 0,
              fontSize: 15
            }}
            role="status"
          >
            ⏰ Reminder: {soonReminders[0].title} due soon!
          </div>
        )}
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
              // Highlight if within next hour
              let highlight = false;
              if (rem.dueDate) {
                const due = new Date(rem.dueDate);
                highlight = due - now > 0 && due - now <= soonThresholdMs;
              }
              return (
                <li
                  key={rem.id}
                  style={{
                    marginBottom: 14,
                    background: highlight ? "#FFF3E0" : "#fff",
                    borderRadius: 7,
                    boxShadow: highlight
                      ? "0 2px 7px rgba(255,152,0,0.09)"
                      : "0 1px 5px rgba(76,175,80,0.05)",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    position: "relative"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {rem.title}
                      {highlight && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontWeight: 700,
                            color: "var(--accent)",
                            fontSize: 14
                          }}
                        >
                          (Due soon)
                        </span>
                      )}
                    </div>
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
                  {/* Edit and Delete buttons */}
                  <button
                    className="btn"
                    aria-label={`Edit reminder "${rem.title}"`}
                    title="Edit reminder"
                    style={{
                      background: "var(--primary)",
                      color: "#fff",
                      borderRadius: 7,
                      fontSize: 13,
                      padding: "4px 13px",
                      minWidth: 0,
                      fontWeight: 600,
                      border: "none"
                    }}
                    onClick={() => handleEditReminder(rem)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    aria-label={`Delete reminder "${rem.title}"`}
                    title="Delete reminder"
                    style={{
                      background: "var(--kavia-orange)",
                      color: "#fff",
                      borderRadius: 7,
                      fontSize: 13,
                      padding: "4px 13px",
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
