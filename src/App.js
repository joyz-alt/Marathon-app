import React, { useState } from "react";
import { useUser } from "./contexts/UserContext"; // Ensure this path is correct
import Auth from "./components/Auth";
import WorkoutPlan from "./components/WorkoutPlan";
import UpdateForm from "./components/UpdateForm";
import Feed from "./components/Feed";
import CurrentDate from "./components/CurrentDate";
import Comments from "./components/Comments";
import "./index.css";

function App() {
  const user = useUser(); 
  const isAdmin = user?.role === "admin";

  // 🆕 New State: Selected Day (Default Empty)
  const [selectedDay, setSelectedDay] = useState("");

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <h1>🏃‍♂️ Marathon Training Plan</h1>

      <CurrentDate />

      {/* Day Selection Dropdown */}
      <label>Select Day:</label>
      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        <option value="">-- Choose a Day --</option>
        {Array.from({ length: 7 }, (_, i) => (
          <option key={i + 1} value={`Day ${i + 1}`}>Day {i + 1}</option>
        ))}
      </select>

      <WorkoutPlan />

      {/* Only Show UpdateForm for Admins */}
      {isAdmin && <UpdateForm selectedDay={selectedDay} />}

      <Feed selectedDay={selectedDay} />
      <Comments selectedDay={selectedDay} />
    </div>
  );
}

export default App;
