import React, { useState } from 'react';

const Comments = ({ onAddComment }) => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment({ username, comment });
    setUsername('');
    setComment('');
  };

  return (
    <div>
      <h3>Commentaires</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Votre nom (ou pseudo)"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Votre commentaire"
        />
        <button type="submit">Poster</button>
      </form>
    </div>
  );
};

export default Comments;