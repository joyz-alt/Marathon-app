import React, { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Compressor from "compressorjs";

const UpdateForm = ({ selectedWeek, selectedDay, user }) => {
  const [updateText, setUpdateText] = useState("");
  const [imageBase64, setImageBase64] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!user || user.role !== "admin") {
    return null; // ✅ Hide form if not admin
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) =>
      new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.85,
          maxWidth: 1200,
          maxHeight: 800,
          mimeType: "image/jpeg",
          convertSize: 1000000,
          success(compressedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => resolve(reader.result);
          },
          error(err) {
            console.error("Image compression error:", err);
            reject(err);
          },
        });
      })
    );

    Promise.all(imagePromises)
      .then((compressedImages) => {
        setImageBase64((prevImages) => [...prevImages, ...compressedImages]);
      })
      .catch((err) => console.error("Error compressing images:", err));
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
    if (imageBase64.length === 0) {
      setStatus("⚠️ Please add at least one image.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      await addDoc(collection(db, "updates"), {
        uid: user.uid,
        username: user.username, // ✅ Save username instead of UID
        updateText,
        images: imageBase64,
        semaine: selectedWeek,
        day: selectedDay,
        timestamp: serverTimestamp(),
        likes: 0,
      });

      setStatus("✅ Update posted successfully!");
      setUpdateText("");
      setImageBase64([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving the update:", error);
      setStatus("❌ Failed to post update.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>📢 Post an Update</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          placeholder="Describe your run..."
          disabled={isLoading}
        />
        <input type="file" ref={fileInputRef} onChange={handleImageChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Publish</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default UpdateForm;
