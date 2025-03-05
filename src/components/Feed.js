import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, runTransaction } from "firebase/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Feed = ({ selectedWeek, selectedDay }) => {
  const [updates, setUpdates] = useState([]);
  const [user] = useAuthState(auth);
  const [selectedImage, setSelectedImage] = useState(null); // ✅ To store clicked image

  useEffect(() => {
    if (!selectedWeek || !selectedDay) return;

    const q = query(
      collection(db, "updates"),
      where("semaine", "==", selectedWeek),
      where("day", "==", selectedDay), 
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUpdates(updatesData);
    });
    

    return () => unsubscribe();
  }, [selectedWeek, selectedDay]);

  const likeUpdate = async (updateId, userId) => {
    if (!userId) {
      alert("You must be logged in to like a post.");
      return;
    }
  
    const updateDocRef = doc(db, "updates", updateId);
    try {
      await runTransaction(db, async (transaction) => {
        const updateDoc = await transaction.get(updateDocRef);
        if (!updateDoc.exists()) {
          throw new Error("Document does not exist!");
        }
  
        const updateData = updateDoc.data();
        const currentLikes = updateData.likes || 0;
        const likedBy = updateData.likedBy || [];
  
        if (likedBy.includes(userId)) {
          // If user already liked, remove like
          transaction.update(updateDocRef, {
            likes: Math.max(0, currentLikes - 1), // Ensure likes never go below 0
            likedBy: likedBy.filter((id) => id !== userId), // Remove user from likedBy list
          });
        } else {
          // If user hasn't liked, add like
          transaction.update(updateDocRef, {
            likes: currentLikes + 1,
            likedBy: [...likedBy, userId], // Add user to likedBy list
          });
        }
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  
  return (
    <div className="container">
      <h2>📜 MAJ semaine {selectedWeek} - {selectedDay}</h2>

      {updates.length === 0 ? (
        <p>No updates for this day yet.</p>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="feed-item">
            <p>{update.updateText}</p>

            {update.images && update.images.length > 0 && (
              <div className="container">
                {update.images.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={imgSrc}
                    alt={`Update ${index}`}
                    className="clickable-image"
                    onClick={() => setSelectedImage(imgSrc)} // ✅ Opens image in modal
                  />
                ))}
              </div>
            )}

            <p>
              <small>
                {update.timestamp
                  ? new Date(update.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp"}
              </small>
            </p>

            <button onClick={() => likeUpdate(update.id, user?.uid)}>
              {update.likedBy?.includes(user?.uid) ? "Unlike" : "Like"}
            </button>
            <span>Likes: {update.likes || 0}</span>
          </div>
        ))
      )}

      {/* ✅ Fullscreen Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full Preview" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default Feed;
