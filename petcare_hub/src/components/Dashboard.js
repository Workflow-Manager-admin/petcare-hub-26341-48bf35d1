import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * Dashboard component for PetCare Hub.
 * Shows a color-coded, visually separated, and actionable list of today's scheduled tasks for all pets.
 * Features:
 * - Shows all tasks due today, grouped & colored per-pet.
 * - Pulls color/info from context (dynamic palette).
 * - Allows marking a task as done (unless already marked).
 * - Highlights "upcoming" tasks (next hour).
 * - Accessibility, contrast, and UI feedback improved.
 */
// PUBLIC_INTERFACE
function Dashboard() {
  const { pets, tasks, setTasks } = usePetCare();

  // Helper: Get today's date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();

  // DRY utility: Color per-pet, persistent and visual
  function getPetColor(petIdx) {
    // Light accessibility-proofed palette
    const palette = [
      "#4CAF50", // green
      "#E87A41", // orange
      "#1976D2", // blue
      "#AB47BC", // purple
      "#FF7043", // deep orange
      "#26A69A", // teal
      "#FFD600", // yellow-accent
      "#C2185B", // magenta
    ];
    return palette[petIdx % palette.length];
  }

  // Group today's tasks by petId (show completed and incomplete)
  const todayTasks = tasks.filter((task) =>
    (!task.date || task.date === todayStr)
  );

  // Sort tasks chronologically (by earliest time), supporting both string/array
  function getTaskTimeVal(task) {
    let v = Array.isArray(task.times) ? task.times[0] : task.times;
    // fallback to "24:00" if missing
    return v && typeof v === "string" && /^\d\d:\d\d/.test(v) ? v : "24:00";
  }
  const sortedTasks = [...todayTasks].sort((a, b) => {
    const ta = getTaskTimeVal(a), tb = getTaskTimeVal(b);
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  // Helper: Get pet info and color by task.petId
  function getPetInfoAndColor(petId) {
    const idx = pets.findIndex((p) => p.id === petId);
    const pet = pets[idx];
    const color = getPetColor(idx >= 0 ? idx : 0);
    return { pet, color };
  }

  // Helper: Is task "upcoming"? (next 60 mins; based on today's date/time)
  function isTaskUpcoming(task) {
    let times = Array.isArray(task.times) ? task.times : [task.times];
    if (!times || !times.length || task.completed) return false;
    const [h, m] = String(times[0] || "").split(":");
    if (!h) return false;
    const dt = new Date(todayStr + "T" + (m ? `${h.padStart(2,"0")}:${m.padStart(2,"0")}` : `${h.padStart(2,"0")}:00`));
    return dt >= now && dt - now <= 60 * 60 * 1000;
  }

  // Mark task as completed (disable for already completed)
  function handleComplete(taskId) {
    setTasks(prev =>
      prev.map((t) =>
        t.id === taskId && !t.completed ? { ...t, completed: true } : t
      )
    );
  }

  // CSS for visual grouping (cards per-pet)
  function cardStyle(petColor, completed, highlight) {
    return {
      borderRadius: 10,
      background:
        highlight
          ? "linear-gradient(95deg, #fffbe9 70%, #ffece2 100%)"
          : "#FAFAFA",
      marginBottom: 15,
      borderLeft: `10px solid ${petColor}`,
      boxShadow: "0 2px 10px rgba(76,175,80,0.08)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: "16px 20px",
      opacity: completed ? 0.52 : 1,
      textDecoration: completed ? "line-through" : undefined,
      position: "relative",
      outline: highlight ? "2.5px solid var(--accent,#FF9800)" : undefined,
      transition: "background .19s,opacity .17s"
    };
  }

  // Accessibility announcements if all tasks are done
  const allComplete =
    sortedTasks.filter((t) => !t.completed).length === 0;

  return (
    <section aria-label="Today's Scheduled Tasks" style={{ width: "100%" }}>
      <h2
        style={{
          color: "var(--primary)",
          marginBottom: "18px",
          fontWeight: 700,
          fontSize: "2rem",
          letterSpacing: "0.01em",
          lineHeight: 1.13,
          textShadow: "0 2px 10px rgba(76,175,80,0.06)",
        }}
      >
        Today's Tasks
      </h2>
      {pets.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "24px 0" }}>
          Add a pet and scheduled tasks to see your daily dashboard here.
        </div>
      ) : allComplete || sortedTasks.length === 0 ? (
        <div
          style={{
            color: "var(--accent)",
            background: "#FFF3E0",
            borderRadius: 12,
            borderLeft: "6px solid var(--primary)",
            padding: "18px 20px",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 15,
            marginTop: 10
          }}
          role="status"
        >
          🎉 All scheduled tasks are complete!
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sortedTasks.map((task, idx) => {
            const { pet, color } = getPetInfoAndColor(task.petId);
            const completed = !!task.completed;
            const highlight = isTaskUpcoming(task);

            // Show time (HH:mm, fallback "--")
            let taskTime = Array.isArray(task.times)
              ? (task.times[0] || "--:--")
              : (task.times || "--:--");
            if (typeof taskTime === "string" && !/:/.test(taskTime)) taskTime = "--:--";
            // Category/notes easter egg
            const detailsExtra =
              (task.category ? (
                <span style={{ background: "#fffbe9", color: color, borderRadius: 7, padding: "2px 8px", fontSize: 11, marginLeft: 6, fontWeight: 600, border: `1px solid ${color}22` }}>
                  {task.category[0]?.toUpperCase() + task.category.slice(1)}
                </span>
              ) : null);

            return (
              <li
                key={task.id}
                style={{
                  ...cardStyle(color, completed, highlight),
                  // Add prominent accent for upcoming task
                  boxShadow: highlight
                    ? "0 3px 17px #FF980022"
                    : cardStyle(color, completed, false).boxShadow,
                  zIndex: highlight ? 2 : 1,
                }}
                aria-label={`Task: ${task.description} (${completed ? "done" : "not done"}) ${highlight ? "due soon" : ""}`}
              >
                {/* Pet avatar or badge */}
                <div style={{ marginRight: 12, minWidth: 38 }}>
                  {pet && pet.photo ? (
                    <img
                      src={pet.photo}
                      alt={`${pet.name || "pet"}'s avatar`}
                      style={{
                        borderRadius: "50%",
                        width: 38,
                        height: 38,
                        objectFit: "cover",
                        border: `2px solid ${color}`,
                        background: "#fff",
                        marginTop: 3,
                        marginBottom: 3,
                      }}
                    />
                  ) : (
                    <div style={{
                      background: color,
                      width: 38, height: 38, borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff", fontWeight: 800,
                      fontSize: 21, marginTop: 3, marginBottom: 3,
                      border: `2px solid ${color}`
                    }}>
                      {pet && pet.name ? pet.name[0] : "🐾"}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: color }}>
                    {task.description}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: "#767676",
                  }}>
                    {pet && pet.name
                      ? (
                        <span>
                          <span style={{
                            background: color + "11",
                            borderRadius: 6,
                            padding: "1.5px 8px",
                            color: color,
                            fontWeight: 600,
                            marginRight: 6,
                            letterSpacing: 0.01,
                          }}>
                            {pet.name}
                          </span>
                          <span style={{ color: "#9e9e9e", fontSize: 12 }}>
                            {pet.species ? (" · " + pet.species) : ""}
                          </span>
                        </span>
                      ) : (
                        "Unassigned Pet"
                      )}
                    {detailsExtra}
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                    Time: <span style={{ fontWeight: 600, color: "#AB47BC" }}>{taskTime}</span>
                    {task.notes && (
                      <span style={{
                        color: "#aaa",
                        fontSize: 11,
                        marginLeft: 7,
                        fontStyle: "italic"
                      }}>
                        {task.notes}
                      </span>
                    )}
                  </div>
                  {highlight && (
                    <div
                      style={{
                        marginTop: 5,
                        color: "var(--accent)",
                        fontWeight: 600,
                        fontSize: 14,
                        letterSpacing: "0.01em",
                        background: "#FFECB3",
                        borderRadius: 5,
                        padding: "2.5px 9px",
                        display: "inline-block",
                      }}
                      role="status"
                    >⏰ Due soon</div>
                  )}

                </div>

                {/* Mark as done button */}
                <div style={{ display: "flex", alignItems: "center", marginLeft: 12 }}>
                  <button
                    className="btn"
                    style={{
                      marginLeft: 0,
                      background: completed ? "#afbdb7" : color,
                      minWidth: 60,
                      fontSize: 15,
                      color: completed ? "#fff" : "#fff",
                      border: completed ? "1.5px solid #f0f4f0" : undefined,
                      textDecoration: completed ? "line-through" : undefined,
                      opacity: completed ? 0.67 : 1,
                      pointerEvents: completed ? "none" : "auto",
                      cursor: completed ? "not-allowed" : "pointer",
                    }}
                    disabled={completed}
                    onClick={() => handleComplete(task.id)}
                    aria-label={completed ? "Task already completed" : "Mark task as completed"}
                  >
                    {completed ? "Done" : "Mark Done"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* End */}
    </section>
  );
}

export default Dashboard;
