import React, { useState, useRef } from "react";
import { usePetCare } from "../PetCareContext";

/**
 * PetProfiles component for PetCare Hub.
 * Displays a list of pet profiles and provides entry points for adding/editing/deleting pets.
 */
// PUBLIC_INTERFACE
function PetProfiles() {
  const { pets, setPets } = usePetCare();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    photo: null,
    photoData: null, // Data URL for preview and storage
  });
  const [formError, setFormError] = useState("");
  const photoInputRef = useRef();

  // Handle form value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  };

  // Handle photo file upload, convert to base64 Data URL for preview/storage
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setForm((old) => ({ ...old, photo: null, photoData: null }));
      return;
    }
    // Accept only images
    if (!file.type.startsWith("image/")) {
      setFormError("Photo must be an image file.");
      return;
    }
    const reader = new window.FileReader();
    reader.onloadend = () => {
      setForm((old) => ({ ...old, photo: file, photoData: reader.result }));
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  // Simple unique ID for pets client-side (timestamp + random)
  const genId = () =>
    "pet_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Validate and add pet
  const handleAddPet = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name.trim() || !form.species.trim() || !form.breed.trim() || !form.age) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (isNaN(parseInt(form.age, 10)) || parseInt(form.age, 10) < 0) {
      setFormError("Age must be a non-negative number.");
      return;
    }
    // Save pet
    setPets((oldPets) => [
      ...oldPets,
      {
        id: genId(),
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed.trim(),
        age: parseInt(form.age, 10),
        photo: form.photoData || null,
        notes: "",
      },
    ]);
    setForm({
      name: "",
      species: "",
      breed: "",
      age: "",
      photo: null,
      photoData: null,
    });
    setFormError("");
    setShowForm(false);
    if (photoInputRef.current) {
      photoInputRef.current.value = ""; // Reset file input visually
    }
  };

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
                  alt={`${pet.name || "pet"}'s photo`}
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
      {showForm ? (
        <form
          aria-label="Add new pet form"
          style={{
            background: "#fafafa",
            borderRadius: 9,
            marginTop: 24,
            padding: "22px 18px 18px 18px",
            boxShadow: "var(--shadow)",
            maxWidth: 420,
          }}
          onSubmit={handleAddPet}
        >
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
              Name*
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                  marginBottom: 6,
                }}
                placeholder="e.g., Bella"
                autoFocus
                aria-label="Pet name"
              />
            </label>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
              Species*
              <input
                type="text"
                name="species"
                value={form.species}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                  marginBottom: 6,
                }}
                placeholder="e.g., Dog, Cat"
                aria-label="Species"
              />
            </label>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
              Breed*
              <input
                type="text"
                name="breed"
                value={form.breed}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                  marginBottom: 6,
                }}
                placeholder="e.g., Golden Retriever"
                aria-label="Breed"
              />
            </label>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
              Age*
              <input
                type="number"
                name="age"
                value={form.age}
                min="0"
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginTop: 3,
                  padding: "8px 7px",
                  borderRadius: 7,
                  border: "1.2px solid #e0e0e0",
                  fontSize: 15,
                  marginBottom: 6,
                }}
                placeholder="Pet age (years)"
                aria-label="Age"
              />
            </label>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>
              Photo
              <input
                type="file"
                accept="image/*"
                name="photo"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                style={{
                  width: "100%",
                  marginTop: 3,
                  marginBottom: 8,
                  fontSize: 14,
                }}
                aria-label="Photo Upload (optional)"
              />
            </label>
            {form.photoData && (
              <div style={{ marginTop: 7, marginBottom: 7 }}>
                <img
                  src={form.photoData}
                  alt="Preview"
                  style={{
                    width: 60, height: 60, objectFit: "cover", borderRadius: "50%",
                    border: "1.5px solid #e0e0e0"
                  }}
                />
                <span style={{ fontSize: 11, color: "#777", marginLeft: 8 }}>
                  Preview
                </span>
              </div>
            )}
          </div>
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

          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <button type="submit" className="btn btn-large" aria-label="Save pet profile">
              Save Pet
            </button>
            <button
              type="button"
              className="btn"
              aria-label="Cancel add pet"
              style={{ background: "transparent", color: "var(--primary)", borderColor: "#e0e0e0" }}
              onClick={() => {
                setShowForm(false);
                setForm({
                  name: "",
                  species: "",
                  breed: "",
                  age: "",
                  photo: null,
                  photoData: null,
                });
                setFormError("");
                if (photoInputRef.current) {
                  photoInputRef.current.value = "";
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="btn btn-large"
          style={{ marginTop: 20 }}
          aria-label="Add Pet"
          onClick={() => setShowForm(true)}
        >
          Add Pet
        </button>
      )}
    </section>
  );
}

export default PetProfiles;
