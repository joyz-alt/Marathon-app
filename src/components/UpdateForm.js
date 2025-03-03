import React, { useState } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from '../contexts/UserContext';

const UpdateForm = () => {
  const [updateText, setUpdateText] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const user = useUser();

  if (!user || user.role !== 'admin') {
    return <div style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
      ⚠️ Access Denied: Only Admins Can Post Updates.
    </div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus("Please log in to post updates.");
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

      await addDoc(collection(db, "updates"), {
        uid: user.uid,
        email: user.email,
        updateText,
        photoURL,
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
      <h2>📢 Post an Update</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Describe what you did today..."
          disabled={isLoading}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Publish</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default UpdateForm;
