import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, runTransaction } from "firebase/firestore";
import { auth } from "../firebase"; // Import Firebase authentication
import { useAuthState } from "react-firebase-hooks/auth"; // Import hook to get current user

const Feed = ({ selectedWeek, selectedDay }) => {
  const [updates, setUpdates] = useState([]);
  const [user] = useAuthState(auth); // Get the currently logged-in user

  useEffect(() => {
    console.log("Selected Week:", selectedWeek);
    console.log("Selected Day:", selectedDay);
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
    }, (error) => {
      console.error("Error loading updates:", error);
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
          // User has already liked it, so remove their like
          transaction.update(updateDocRef, {
            likes: Math.max(0, currentLikes - 1), // Ensure likes never go below 0
            likedBy: likedBy.filter((id) => id !== userId), // Remove user from likedBy list
          });
        } else {
          // User has not liked it, so add their like
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

      {selectedWeek && selectedDay && updates.length === 0 ? (
        <p>No updates for this day yet.</p>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="feed-item">
            <h4>{update.email}</h4>
            <p>{update.updateText}</p>

            {update.images && update.images.length > 0 && (
              <div className="image-container">
                {update.images.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt={`Update ${index}`} />
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
    </div>
  );
};

export default Feed;
