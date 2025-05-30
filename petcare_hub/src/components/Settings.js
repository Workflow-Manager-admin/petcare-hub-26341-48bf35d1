import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * Settings component for PetCare Hub.
 * Allows users to adjust in-app reminder and UI preferences.
 * (Settings and toggles to be implemented; placeholder for now.)
 */
// PUBLIC_INTERFACE
function Settings() {
  const { reminders } = usePetCare();

  return (
    <section aria-label="Settings" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 18, fontWeight: 600 }}>
        Settings
      </h2>
      <div style={{
        background: "#FAFAFA",
        borderRadius: 9,
        boxShadow: "var(--shadow)",
        padding: "17px 18px"
      }}>
        <div style={{ fontWeight: 500, marginBottom: 10 }}>
          In-app Reminders &amp; Preferences
        </div>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 17 }}>
          Configure task and health event reminders, app UI settings, and more.
        </div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>
          (Settings form coming soon)
        </div>
        <div style={{ color: "#bbb", fontSize: 12 }}>
          {reminders && reminders.length
            ? `There are ${reminders.length} reminder(s) configured.`
            : "No reminders set yet."}
        </div>
      </div>
    </section>
  );
}

export default Settings;
