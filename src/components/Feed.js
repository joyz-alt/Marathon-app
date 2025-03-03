import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, runTransaction, updateDoc } from "firebase/firestore";

const Feed = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("timestamp", "desc"));
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
  }, []);

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
      <h2>Feed des mises à jour</h2>
      {updates.map((update) => (
        <div key={update.id} className="feed-item">
          <h4>{update.email}</h4>
          <p>{update.updateText}</p>
          {update.photoURL && (
            <img src={update.photoURL} alt="Mise à jour" />
          )}
          <p>
            <small>
              {update.timestamp ? new Date(update.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}
            </small>
          </p>
          <button onClick={() => likeUpdate(update.id)}>Like</button>
          <span>Likes: {update.likes || 0}</span>
        </div>
      ))}
    </div>
  );
};

export default Feed;
