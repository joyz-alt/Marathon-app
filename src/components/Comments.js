import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const Comments = ({ selectedWeek, selectedDay, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!selectedWeek || !selectedDay) return;

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("semaine", "==", selectedWeek),
      where("jour", "==", selectedDay),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, [selectedWeek, selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedWeek || !selectedDay) {
      alert("⚠️ Please select a week and day before posting a comment.");
      return;
    }
    if (!user) {
      alert("⚠️ You must be logged in to post a comment.");
      return;
    }
    if (!comment.trim()) {
      alert("⚠️ Your comment cannot be empty.");
      return;
    }

    await addDoc(collection(db, "comments"), {
      username: user.username, // ✅ Use the parent's user object
      comment,
      semaine: selectedWeek,
      jour: selectedDay,
      timestamp: serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="container">
      <h3>📝 Commentaire semaine {selectedWeek} - {selectedDay}</h3>

      {selectedWeek && selectedDay && comments.length === 0 ? (
        <p>Toujours pas de commentaire</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-list p">
            <p>
              <strong>{c.username}</strong>: {c.comment}
            </p>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Votre commentaire..."
          className="comment-input"
        />
        <button type="submit" className="comment-button">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Comments;
