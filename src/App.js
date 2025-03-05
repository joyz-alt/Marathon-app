import React, { useState } from "react";
import { useUser } from "./contexts/UserContext";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import Auth from "./components/Auth";
import WorkoutPlan from "./components/WorkoutPlan";
import UpdateForm from "./components/UpdateForm";
import Feed from "./components/Feed";
import Comments from "./components/Comments";
import Sponsors from "./components/Sponsors"; // ✅ Import Sponsors component
import "./index.css";

function App() {
  const user = useUser();
  const isAdmin = user?.role === "admin";

  // ✅ Keep Week & Day selection state here so all components can use it
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload(); // Refresh page after logout
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <div className="header-container">
        <h1>🏃‍♂️ Plan d'Entrainement de Callaghan 🏃‍♂️</h1>
      </div>

      {/* ✅ Pass week & day state to WorkoutPlan */}
      <WorkoutPlan
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      {/* ✅ Ensure updates are posted to the correct week & day */}
      {isAdmin && <UpdateForm selectedWeek={selectedWeek} selectedDay={selectedDay} />}

      {/* ✅ Updates appear below WorkoutPlan & are filtered by week/day */}
      <Feed selectedWeek={selectedWeek} selectedDay={selectedDay} />

      {/* ✅ Comments are also linked to the selected week & day */}
      <Comments selectedWeek={selectedWeek} selectedDay={selectedDay} />

      {/* ✅ Add Sponsors Section */}
      <Sponsors />
      <button className="logout-button" onClick={handleLogout}>Logout</button>

    </div>
  );
}

export default App;
