import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);  // Track loading state

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStatus("Registration successful!");
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("Login successful!");
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Connexion / Inscription</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <div>
          <button type="button" onClick={handleRegister} disabled={isLoading}>Inscription</button>
          <button type="submit" disabled={isLoading}>Connexion</button>
        </div>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default Auth;
