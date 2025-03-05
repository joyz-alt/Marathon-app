import React from "react";
import { trainingPlan } from "../trainingPlan";

const WorkoutPlan = ({ selectedWeek, setSelectedWeek, selectedDay, setSelectedDay }) => {
  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    setSelectedDay(""); // Reset day selection when week changes
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const getWeekLabel = (week) => {
    let label = `S${week}`;

    if (week <= 4) {
      label += " - Construction de l’endurance";
    } else if (week >= 5 && week <= 7) {
      label += " - Augmentation du volume et de l’intensité";
    } else {
      label += " - Affinage et préparation finale";
    }

    if ([4, 7, 12].includes(Number(week))) {
      label += " (allégée)";
    }

    return label;
  };

  const renderPlan = () => {
    if (!selectedWeek || !selectedDay) return null;
    const dayData = trainingPlan[selectedWeek]?.[selectedDay];
    if (!dayData) return null;

    return (
      <div className="workout-card">
        <h3>{selectedDay} - Semaine {selectedWeek}</h3>
        <p><strong>🏃 Distance :</strong> {dayData.distance} km</p>
        <p><strong>📌 Type :</strong> {dayData.type}</p>
        {dayData.pace && <p><strong>⚡ Allure :</strong> {dayData.pace}</p>}
        {dayData.notes && <p><strong>📝 Notes :</strong> {dayData.notes}</p>}
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Plan d'entraînement</h2>
      <div className="select-container">
        <select value={selectedWeek} onChange={handleWeekChange}>
          <option value="">-- Sélectionnez une semaine --</option>
          {Object.keys(trainingPlan).map((week) => (
            <option key={week} value={week}>{getWeekLabel(week)}</option>
          ))}
        </select>

        <select value={selectedDay} onChange={handleDayChange} disabled={!selectedWeek}>
          <option value="">-- Sélectionnez un jour --</option>
          {selectedWeek && Object.keys(trainingPlan[selectedWeek]).map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {renderPlan()}
    </div>
  );
};

export default WorkoutPlan;
