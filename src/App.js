import React, { useState } from "react";
import { useUser } from "./contexts/UserContext";
import Auth from "./components/Auth";
import WorkoutPlan from "./components/WorkoutPlan";
import UpdateForm from "./components/UpdateForm";
import Feed from "./components/Feed";
import Comments from "./components/Comments";
import "./index.css";

function App() {
  const user = useUser(); 
  const isAdmin = user?.role === "admin";

  // ✅ Keep Week & Day selection state here so all components can use it
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <h1>🏃‍♂️ Marathon Training Plan</h1>

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
    </div>
  );
}

export default App;
