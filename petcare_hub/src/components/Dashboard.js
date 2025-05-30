import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * Dashboard component for PetCare Hub.
 * Shows a consolidated, color-coded list of today's scheduled tasks for all pets.
 */
// PUBLIC_INTERFACE
function Dashboard() {
  const { pets, tasks, setTasks } = usePetCare();

  // Helper: Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().slice(0, 10);

  // Tasks for today, group by petId
  const todaysTasks = tasks.filter(
    (task) =>
      (!task.date || task.date === todayStr) && !task.completed // only incomplete for today
  );

  // Color palette for pets by index for color-coding (uses accent/primary)
  const petColors = ["#4CAF50", "#E87A41", "#FF9800", "#1A1A1A", "#1976D2"];

  // Mark task as completed
  const handleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      )
    );
  };

  return (
    <section aria-label="Today's Scheduled Tasks" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: "16px", fontWeight: 600 }}>
        Today's Tasks
      </h2>
      {todaysTasks.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "24px 0" }}>
          🎉 All scheduled tasks are complete!
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {todaysTasks.map((task, idx) => {
            const pet = pets.find((p) => p.id === task.petId) || {};
            const bg = petColors[
              (pets.findIndex((p) => p.id === task.petId) + petColors.length) % petColors.length
            ];
            return (
              <li
                key={task.id}
                style={{
                  borderRadius: 9,
                  background: "#FAFAFA",
                  marginBottom: 13,
                  borderLeft: `8px solid ${bg}`,
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                }}
                aria-label={`Task: ${task.description}`}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>
                    {task.description}
                  </span>
                  <div style={{ fontSize: 13, color: "#767676" }}>
                    {pet.name ? `For: ${pet.name}` : "Unassigned Pet"}
                  </div>
                  {task.times && <div style={{ fontSize: 12, color: "#bbb" }}>
                    Time: {Array.isArray(task.times) ? task.times.join(", ") : task.times}
                  </div>}
                </div>
                <button
                  className="btn"
                  style={{ marginLeft: 12, background: bg, minWidth: 60, fontSize: 14 }}
                  onClick={() => handleComplete(task.id)}
                  aria-label="Mark as completed"
                >
                  Done
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Dashboard;
