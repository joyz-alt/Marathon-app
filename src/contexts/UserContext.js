// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                const userRef = doc(db, "users", firebaseUser.uid);
                onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setUser({ ...firebaseUser, role: snapshot.data().role || "user" }); // Default to "user"
                    } else {
                        setUser({ ...firebaseUser, role: "user" }); // Ensure a default role
                    }
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
