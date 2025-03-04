import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, runTransaction } from "firebase/firestore";

const Feed = ({ selectedWeek, selectedDay }) => {  
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if (!selectedWeek || !selectedDay) return; // ✅ Ensure both are selected before querying

    const q = query(
      collection(db, "updates"),
      where("semaine", "==", selectedWeek),  
      where("day", "==", selectedDay),       
      orderBy("timestamp", "desc") // ✅ Ensure Firestore index includes this
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
  }, [selectedWeek, selectedDay]); // ✅ Only runs when week or day changes

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
      <h2>📜 Updates for Week {selectedWeek} - {selectedDay}</h2>

      {selectedWeek && selectedDay && updates.length === 0 ? (
        <p>No updates for this day yet.</p>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="feed-item">
            <h4>{update.email}</h4>
            <p>{update.updateText}</p>
            
            {/* ✅ Fix: Display Base64 image instead of Firebase Storage URL */}
            {update.imageBase64 && (
              <img 
                src={update.imageBase64} 
                alt="Update" 
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
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
