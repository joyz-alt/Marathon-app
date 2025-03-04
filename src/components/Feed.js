import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, runTransaction } from "firebase/firestore";

const Feed = ({ selectedDay }) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!selectedDay) return; // Don't fetch anything if no day is selected

    const q = query(
      collection(db, "updates"),
      where("day", "==", selectedDay), // Filter updates for the selected day
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
  }, [selectedDay]);

  const likeUpdate = async (updateId) => {
    const updateDocRef = doc(db, "updates", updateId);
    try {
      await runTransaction(db, async (transaction) => {
        const updateDoc = await transaction.get(updateDocRef);
        if (!updateDoc.exists()) {
          throw new Error("Document does not exist!");
        }
        const currentLikes = updateDoc.data().likes || 0;
        transaction.update(updateDocRef, { likes: currentLikes + 1 });
      });
    } catch (error) {
      console.error("Error liking update:", error);
    }
  };

  return (
    <div>
      <h2>📜 Updates for {selectedDay || "Select a Day"}</h2>

      {selectedDay && updates.length === 0 ? (
        <p>No updates for {selectedDay} yet.</p>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="feed-item">
            <h4>{update.email}</h4>
            <p>{update.updateText}</p>
            {update.photoURL && (
              <img src={update.photoURL} alt="Mise à jour" />
            )}
            <p>
              <small>
                {update.timestamp
                  ? new Date(update.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp"}
              </small>
            </p>
            <button onClick={() => likeUpdate(update.id)}>Like</button>
            <span>Likes: {update.likes || 0}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
