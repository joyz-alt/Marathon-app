import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const Auth = ({ user, setUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      if (isRegistering) {
        // Register User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });

        // Save user data in Firestore
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          username,
          email,
        });

        setUser({ uid: userCredential.user.uid, username });
        setStatus("✅ Account created successfully!");
      } else {
        // Login User
        let userCredential;
        
        if (email.includes("@")) {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } else {
          // Search for user by username
          const usersQuery = query(collection(db, "users"), where("username", "==", email));
          const querySnapshot = await getDocs(usersQuery);
          
          if (querySnapshot.empty) {
            setStatus("❌ No account found with this username.");
            return;
          }
          
          const userEmail = querySnapshot.docs[0].data().email;
          userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        }

        setUser({ uid: userCredential.user.uid, username: userCredential.user.displayName });
        setStatus("✅ Logged in successfully!");
      }
    } catch (error) {
      setStatus(`❌ ${error.message}`);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setStatus("✅ Logged out successfully!");
    } catch (error) {
      setStatus(`❌ ${error.message}`);
    }
  };

  return (
    <div id="auth-section">
      {user ? (
        <div>
          <h2>Welcome, {user.username || "User"}! 🎉</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isRegistering ? "Create an Account" : "Login"}</h2>
          <form onSubmit={handleAuth}>
            {isRegistering && (
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            )}
            <input type="text" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
          </p>
        </>
      )}
      {status && <p id="auth-status">{status}</p>}
    </div>
  );
};

export default Auth;
