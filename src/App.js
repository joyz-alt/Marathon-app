import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Auth from "./components/Auth";
import WorkoutPlan from "./components/WorkoutPlan";
import UpdateForm from "./components/UpdateForm";
import Feed from "./components/Feed";
import Comments from "./components/Comments";
import Sponsors from "./components/Sponsors";
import WelcomeMessage from "./components/WelcomeMessage";
import CalendarPlan from "./components/CalendarPlan"; 

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser({ uid: authUser.uid, username: authUser.displayName || "Utilisateur" });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.reload();
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div>
      {/* ✅ Pass the username to WelcomeMessage */}
      <WelcomeMessage username={user.username || "Utilisateur"} />

      <div className="header-container">
        <h1>🏃‍♂️ Plan d'Entrainement de Callaghan 🏃‍♂️</h1>
      </div>

      <WorkoutPlan
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <CalendarPlan selectedWeek={selectedWeek} />

      {/* ✅ Ensure username is passed to UpdateForm */}
      <UpdateForm selectedWeek={selectedWeek} selectedDay={selectedDay} user={user} />

      <Feed selectedWeek={selectedWeek} selectedDay={selectedDay} />
      <Comments selectedWeek={selectedWeek} selectedDay={selectedDay}   user={user} />
      <Sponsors />

      <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}

export default App;
