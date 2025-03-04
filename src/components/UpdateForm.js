import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "../contexts/UserContext";

const UpdateForm = ({ selectedWeek, selectedDay }) => {
  const [updateText, setUpdateText] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const user = useUser();

  if (!user || user.role !== "admin") {
    return null; // ✅ Hide form if not admin
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus("Please log in to post updates.");
      return;
    }
    if (!selectedWeek || !selectedDay) {
      setStatus("⚠️ Please select a week and day.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      await addDoc(collection(db, "updates"), {
        uid: user.uid,
        email: user.email,
        updateText,
        imageBase64,
        semaine: selectedWeek, // ✅ Include selectedWeek
        day: selectedDay, // ✅ Include selectedDay
        timestamp: serverTimestamp(),
        likes: 0,
      });

      setStatus("✅ Update posted successfully!");
      setUpdateText("");
      setImageBase64("");
    } catch (error) {
      console.error("Error saving the update:", error);
      setStatus("❌ Failed to post update.");
    }

    setLoading(false);
  };

  return (
    <div className="update-container">
      <h2>📢 Post an Update</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Describe your run..."
          disabled={isLoading}
        />
        <input type="file" onChange={handleImageChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Publish</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default UpdateForm;
