import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const Comments = ({ selectedWeek, selectedDay }) => {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!selectedWeek || !selectedDay) return; // ✅ Ensure both week & day are selected

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("semaine", "==", selectedWeek), // ✅ Matches Firestore structure
      where("jour", "==", selectedDay),     // ✅ Matches Firestore structure
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
  }, [selectedWeek, selectedDay]); // ✅ Dependency update

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWeek || !selectedDay) {
      alert("Please select a week and day before posting a comment.");
      return;
    }

    await addDoc(collection(db, "comments"), {
      username,
      comment,
      semaine: selectedWeek, // ✅ Store selected week
      jour: selectedDay,     // ✅ Store selected day
      timestamp: serverTimestamp(),
    });

    setUsername("");
    setComment("");
  };

  return (
    <div>
      <h3>📝 Comments for Week {selectedWeek} - {selectedDay}</h3>

      {selectedWeek && selectedDay && comments.length === 0 ? (
        <p>No comments for this day yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.username}</strong>: {c.comment}
            <p>
              <small>
                {c.timestamp && c.timestamp.seconds
                  ? new Date(c.timestamp.seconds * 1000).toLocaleString()
                  : "No timestamp available"}
              </small>
            </p>
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
