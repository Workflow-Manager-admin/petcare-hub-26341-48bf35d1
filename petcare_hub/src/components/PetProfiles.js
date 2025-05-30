import React from "react";
import { usePetCare } from "../PetCareContext";

/**
 * PetProfiles component for PetCare Hub.
 * Displays a list of pet profiles and provides entry points for adding/editing/deleting pets.
 */
// PUBLIC_INTERFACE
function PetProfiles() {
  const { pets } = usePetCare();

  return (
    <section aria-label="Pet Profiles" style={{ width: "100%" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: "18px", fontWeight: 600 }}>
        Pet Profiles
      </h2>
      {pets.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", padding: "24px 0" }}>
          No pets created yet. Click "Add Pet" to get started!
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pets.map((pet, i) => (
            <li
              key={pet.id}
              style={{
                borderRadius: 9,
                border: "1.5px solid var(--border-light)",
                marginBottom: 12,
                background: "#fff",
                boxShadow: "var(--shadow)",
                display: "flex",
                gap: 16,
                alignItems: "center",
                padding: "14px 18px",
              }}
            >
              {pet.photo && (
                <img
                  src={pet.photo}
                  alt={`${pet.name}'s photo`}
                  style={{
                    width: 54,
                    height: 54,
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginRight: 12,
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>{pet.name || "Unnamed Pet"}</div>
                <div style={{ fontSize: 13, color: "#777" }}>
                  {[
                    pet.species,
                    pet.breed,
                    pet.age ? `Age: ${pet.age}` : null,
                  ]
                    .filter(Boolean)
                    .join(" | ")}
                </div>
                {pet.notes && (
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>
                    {pet.notes}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="btn btn-large"
        style={{ marginTop: 20 }}
        aria-label="Add Pet"
        // To be implemented: open add pet modal/form
      >
        Add Pet
      </button>
    </section>
  );
}

export default PetProfiles;
