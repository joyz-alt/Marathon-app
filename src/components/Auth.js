import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc, getDoc, query, where, getDocs } from "firebase/firestore";

const Auth = ({ setUser }) => {
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
        // ✅ Register User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Update profile with username
        await updateProfile(user, { displayName: username });

        console.log("✅ User created:", user);

        // ✅ Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          email: email,
        });

        console.log("✅ User saved in Firestore");

        // ✅ Immediately update state with username
        setUser({ uid: user.uid, username });

        setStatus("✅ Account created successfully!");
      } else {
        // ✅ Login User
        let userCredential;
        if (email.includes("@")) {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } else {
          // ✅ Find user by username
          const usersQuery = query(collection(db, "users"), where("username", "==", email));
          const querySnapshot = await getDocs(usersQuery);

          if (querySnapshot.empty) {
            setStatus("❌ No account found with this username.");
            return;
          }

          const userEmail = querySnapshot.docs[0].data().email;
          userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        }

        // ✅ Fetch username from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const username = userDoc.exists() ? userDoc.data().username : "Utilisateur";

        console.log("✅ Retrieved username from Firestore:", username);

        // ✅ Ensure username updates in state
        setUser({ uid: userCredential.user.uid, username });

        setStatus("✅ Logged in successfully!");
      }
    } catch (error) {
      console.error("❌ Firebase Error:", error);
      setStatus(`❌ ${error.message}`);
    }
  };

  return (
    <div id="auth-section" className="container">
      <h2>{isRegistering ? "Créer un compte" : "Connexion"}</h2>
      <form onSubmit={handleAuth}>
        {isRegistering && (
          <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
        )}
        <input type="text" placeholder="Email ou Nom d'utilisateur" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegistering ? "S'inscrire" : "Se connecter"}</button>
      </form>
      <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Déjà un compte ? Connectez-vous" : "Pas encore inscrit ? Créez un compte"}
      </p>
      {status && <p id="auth-status">{status}</p>}
    </div>
  );
};

export default Auth;
