import React, { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from '../contexts/UserContext';

const UpdateForm = ({ selectedDay }) => {
  const [updateText, setUpdateText] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const user = useUser();

  // Hide form if the user is NOT an admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure a day is selected
    if (!selectedDay) {
      setStatus("❌ Please select a day before posting.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      let photoURL = "";
      if (file) {
        const fileRef = ref(storage, `updates/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        photoURL = await getDownloadURL(uploadResult.ref);
      }

      // Save the update linked to the selected day
      await addDoc(collection(db, "updates"), {
        uid: user.uid,
        email: user.email,
        updateText,
        photoURL,
        day: selectedDay, // Store the selected day
        timestamp: serverTimestamp(),
        likes: 0,
      });

      setStatus("✅ Update posted successfully!");
      setUpdateText("");
      setFile(null);
    } catch (error) {
      console.error("Error saving the update:", error);
      setStatus("❌ Failed to post update.");
    }

    setLoading(false);
  };

  return (
    <div className="update-container">
      <h2>📢 Post an Update for {selectedDay || "Select a Day"}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Describe what you did today..."
          disabled={isLoading}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={isLoading} />
        <button type="submit" disabled={isLoading || !selectedDay}>Publish</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default UpdateForm;
