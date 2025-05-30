import React, { useState } from "react";
import { usePetCare } from "../PetCareContext";

/**
 * TaskScheduler component for PetCare Hub.
 * Enables viewing, adding, and editing of recurring care tasks for each pet.
 * Now includes an "Add Task" form with validation and PetCareContext integration.
 */
// PUBLIC_INTERFACE
function TaskScheduler() {
  const { pets, tasks, setTasks } = usePetCare();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: "",
    petId: "",
    category: "",
    recurrence: "once",
    customRecurrence: "",
    time: "",
    notes: "",
  });
  const [editId, setEditId] = useState(null); // If non-null, editing a task
  const [formError, setFormError] = useState("");

  // Unique Task ID generator (timestamp + random)
  const genTaskId = () =>
    "task_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const TASK_CATEGORIES = [
    { value: "feeding", label: "Feeding" },
    { value: "walking", label: "Walking" },
    { value: "medication", label: "Medication" },
    { value: "other", label: "Other" },
  ];

  const RECURRENCE_OPTIONS = [
    { value: "once", label: "Once" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "custom", label: "Custom" },
  ];

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
    setFormError("");
  };

  // Form validate and submit
  const handleAddTask = (e) => {
    e.preventDefault();
    // Validate input
    if (!form.description.trim()) {
      setFormError("Please provide a task name.");
      return;
    }
    if (!form.petId) {
      setFormError("Please select a pet.");
      return;
    }
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }
    if (!form.recurrence) {
      setFormError("Please select recurrence.");
      return;
    }
    if (form.recurrence === "custom" && !form.customRecurrence.trim()) {
      setFormError("Please specify custom recurrence.");
      return;
    }
    if (!form.time) {
      setFormError("Please select time.");
      return;
    }

    // Compose frequency string for storage
    let frequency =
      form.recurrence === "custom"
        ? form.customRecurrence.trim()
        : form.recurrence.charAt(0).toUpperCase() + form.recurrence.slice(1);

    // New task record
    const newTask = {
      id: genTaskId(),
      petId: form.petId,
      category: form.category,
      description: form.description.trim(),
      frequency: frequency,
      times: form.time,
      notes: form.notes.trim(),
      completed: false,
      // Optional: set current date for "once" or for filtering (may adapt later)
      date: form.recurrence === "once" ? new Date().toISOString().slice(0, 10) : undefined,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setForm({
      description: "",
      petId: "",
      category: "",
      recurrence: "once",
      customRecurrence: "",
      time: "",
      notes: "",
    });
    setShowForm(false);
    setFormError("");
  };

  return (
    <section aria-label="Task Scheduler" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 18, fontWeight: 600 }}>
        Care Task Scheduler
      </h2>

      {/* Add Task Button or Form */}
      {pets.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "22px 0" }}>
          Add a pet profile to begin scheduling tasks.
        </div>
      ) : (
        <>
          {!showForm ? (
            <button
              className="btn btn-large"
              style={{ marginBottom: 25 }}
              aria-label="Add Task"
              onClick={() => setShowForm(true)}
            >
              Add Task
            </button>
          ) : (
            <form
              aria-label="Add Task Form"
              style={{
                background: "#fafafa",
                borderRadius: 9,
                margin: "18px 0",
                padding: "20px 18px 18px 18px",
                boxShadow: "var(--shadow)",
                maxWidth: 420,
              }}
              onSubmit={handleAddTask}
            >
              {/* Task Name */}
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
                Task Name*
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    marginTop: 3,
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                  }}
                  placeholder="e.g., Give breakfast"
                  autoFocus
                  aria-label="Task Name"
                />
              </label>

              {/* Pet Selector */}
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
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                  }}
                  aria-label="Select Pet"
                >
                  <option value="">Select a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name ? `${pet.name} (${pet.species})` : pet.id}
                    </option>
                  ))}
                </select>
              </label>

              {/* Category */}
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
                Category*
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    marginTop: 3,
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                  }}
                  aria-label="Select Category"
                >
                  <option value="">Choose category</option>
                  {TASK_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </label>

              {/* Recurrence */}
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
                Recurrence*
                <select
                  name="recurrence"
                  value={form.recurrence}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    marginTop: 3,
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                  }}
                  aria-label="Recurrence"
                >
                  {RECURRENCE_OPTIONS.map((rec) => (
                    <option key={rec.value} value={rec.value}>{rec.label}</option>
                  ))}
                </select>
              </label>
              {/* Custom Recurrence */}
              {form.recurrence === "custom" && (
                <label style={{ display: "block", fontWeight: 500, marginBottom: 4, marginTop: -8 }}>
                  Custom Recurrence
                  <input
                    type="text"
                    name="customRecurrence"
                    value={form.customRecurrence}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      marginTop: 3,
                      marginBottom: 9,
                      padding: "8px 7px",
                      borderRadius: 7,
                      border: "1.2px solid #e0e0e0",
                      fontSize: 15,
                    }}
                    placeholder="Describe recurrence (e.g., Every 3 days)"
                    aria-label="Custom Recurrence"
                  />
                </label>
              )}

              {/* Time */}
              <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
                Time*
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    marginTop: 3,
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                  }}
                  aria-label="Task Time"
                />
              </label>

              {/* Notes */}
              <label style={{ display: "block", fontWeight: 500, marginBottom: 3 }}>
                Notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  style={{
                    width: "100%",
                    marginTop: 3,
                    marginBottom: 9,
                    padding: "8px 7px",
                    borderRadius: 7,
                    border: "1.2px solid #e0e0e0",
                    fontSize: 15,
                    resize: "vertical"
                  }}
                  placeholder="Any extra info (optional)"
                  aria-label="Notes"
                />
              </label>

              {/* Validation message */}
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
              <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
                <button
                  type="submit"
                  className="btn btn-large"
                  aria-label="Save New Task"
                >
                  Save Task
                </button>
                <button
                  type="button"
                  className="btn"
                  aria-label="Cancel Add Task"
                  style={{
                    background: "transparent",
                    color: "var(--primary)",
                    borderColor: "#e0e0e0"
                  }}
                  onClick={() => {
                    setForm({
                      description: "",
                      petId: "",
                      category: "",
                      recurrence: "once",
                      customRecurrence: "",
                      time: "",
                      notes: "",
                    });
                    setShowForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of tasks by pet */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: 10 }}>
            {pets.map((pet) => {
              const petTasks = tasks.filter((t) => t.petId === pet.id);
              return (
                <li
                  key={pet.id}
                  style={{
                    marginBottom: 18,
                    background: "#FAFAFA",
                    borderRadius: 9,
                    boxShadow: "var(--shadow)",
                    padding: "13px 17px",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 5 }}>
                    {pet.name}
                    <span style={{ fontWeight: 400, color: "#aaa", fontSize: 13, marginLeft: 8 }}>
                      {pet.species}
                    </span>
                  </div>
                  {petTasks.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#bbb" }}>
                      No tasks yet. Click "Add Task" to get started!
                    </div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 12 }}>
                      {petTasks.map((task) => (
                        <li key={task.id} style={{ marginBottom: 7, display: "flex", alignItems: "center" }}>
                          <span>
                            {task.description}{" "}
                            <span style={{ color: "#888", fontSize: 12 }}>
                              {task.frequency ? `(${task.frequency})` : ""}
                              {task.times ? ` at ${Array.isArray(task.times) ? task.times.join(", ") : task.times}` : ""}
                            </span>
                            {task.notes && (
                              <span style={{ color: "#aaa", fontSize: 11, marginLeft: 4 }}>
                                - {task.notes}
                              </span>
                            )}
                          </span>
                          <button
                            className="btn"
                            style={{
                              marginLeft: 12,
                              background: "var(--kavia-orange)",
                              color: "#fff",
                              borderRadius: 6,
                              fontSize: 13,
                              padding: "3px 14px"
                            }}
                            aria-label={`Delete task "${task.description}"`}
                            title="Delete task"
                            onClick={() => {
                              // Remove task from global state using setTasks
                              setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="btn"
                    style={{ marginTop: 10, fontSize: 14 }}
                    aria-label={`Add task for ${pet.name}`}
                    onClick={() => {
                      // Prefill pet for form
                      setForm((old) => ({
                        ...old,
                        petId: pet.id,
                      }));
                      setShowForm(true);
                      setFormError("");
                    }}
                  >
                    Add Task
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export default TaskScheduler;
