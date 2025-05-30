import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * TaskScheduler component for PetCare Hub.
 * Enables viewing, adding, and editing of recurring care tasks for each pet.
 * (Task create/edit UI forms will be added in full implementation.)
 */
// PUBLIC_INTERFACE
function TaskScheduler() {
  const { pets, tasks } = usePetCare();

  return (
    <section aria-label="Task Scheduler" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 18, fontWeight: 600 }}>
        Care Task Scheduler
      </h2>
      {pets.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "22px 0" }}>
          Add a pet profile to begin scheduling tasks.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                      <li key={task.id} style={{ marginBottom: 7 }}>
                        <span>{task.description}</span>{" "}
                        <span style={{ color: "#888", fontSize: 12 }}>
                          {task.frequency ? `(${task.frequency})` : ""}
                          {task.times ? ` at ${Array.isArray(task.times) ? task.times.join(", ") : task.times}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="btn"
                  style={{ marginTop: 10, fontSize: 14 }}
                  aria-label={`Add task for ${pet.name}`}
                  // To be implemented: open add task form/modal for this pet
                >
                  Add Task
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TaskScheduler;
