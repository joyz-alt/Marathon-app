import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const Comments = ({ selectedWeek, selectedDay }) => {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log("Selected Week in Comments:", selectedWeek);
    console.log("Selected Day in Comments:", selectedDay);

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
      setComments(commentsList);  // ✅ Correct function instead of setUpdates
    });

    return () => unsubscribe();
  }, [selectedWeek, selectedDay]);

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
    <div className="container">
      <h3>📝 Commentaire semaine {selectedWeek} - {selectedDay}</h3>

      {selectedWeek && selectedDay && comments.length === 0 ? (
        <p>Toujours pas de commentaire today</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-list p">

            <p>
              <strong>{c.username} </strong>
              <div>: {c.comment} </div>
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
          className="comment-input"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your comment"
          className="comment-input"
        />
        <button type="submit" className="comment-button">Envoyer</button>
      </form>
    </div>
  );
};

export default Comments;
