import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const Comments = ({ selectedDay }) => {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!selectedDay) return; // Don't fetch comments if no day is selected

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("day", "==", selectedDay), // Filter by selected day
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
  }, [selectedDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDay) {
      alert("Please select a day before posting a comment.");
      return;
    }

    await addDoc(collection(db, "comments"), {
      username,
      comment,
      day: selectedDay, // Store the selected day
      timestamp: serverTimestamp(),
    });

    setUsername("");
    setComment("");
  };

  return (
    <div>
      <h3>📝 Comments for {selectedDay || "Select a Day"}</h3>

      {selectedDay && comments.length === 0 ? (
        <p>No comments for {selectedDay} yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.username}</strong>: {c.comment}
            <p><small>{new Date(c.timestamp.seconds * 1000).toLocaleString()}</small></p>
          </div>
        ))
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your comment"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Comments;
