// src/App.js
import React from "react";
import { useUser } from "./contexts/UserContext"; // ensure this path is correct
import Auth from "./components/Auth";
import WorkoutPlan from "./components/WorkoutPlan";
import UpdateForm from "./components/UpdateForm";
import Feed from "./components/Feed";
import CurrentDate from "./components/CurrentDate";
import Comments from "./components/Comments";
import "./index.css";

function App() {
  const user = useUser(); // useUser will now handle the user state

  if (!user) {
    // Show Auth component only
    return <Auth />;
  }

  // Admin check (replace 'admin' with your actual admin role identifier)
  const isAdmin = user.role === 'admin';

  return (
    <div>
      <h1>Plan d'entraînement Marathon de Callaghan</h1>
      <CurrentDate />
      <WorkoutPlan />
      {isAdmin && <UpdateForm />}
      <Feed />
      <Comments />
      
    </div>
  );
}

export default App;
