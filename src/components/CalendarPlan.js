import React, { useEffect, useState } from "react";
import { trainingPlan } from "../trainingPlan";

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const CalendarPlan = ({ selectedWeek }) => {
  // We’ll keep track of a small fade-in animation each time the week changes
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    // Trigger re-render with a new key => triggers CSS fade-in
    setFadeKey((prev) => prev + 1);
  }, [selectedWeek]);

  if (!selectedWeek) {
    return (
      <div className="calendar-carousel-container">
        <p>Veuillez sélectionner une semaine.</p>
      </div>
    );
  }

  const weekData = trainingPlan[selectedWeek];
  if (!weekData) {
    return (
      <div className="calendar-carousel-container">
        <p>Aucune donnée pour la semaine {selectedWeek}.</p>
      </div>
    );
  }

  return (
    <div className="calendar-carousel-container fade-in" key={fadeKey}>
      <h2 className="carousel-title">Semaine {selectedWeek}</h2>

      <div className="carousel-scroll-area">
        {daysOfWeek.map((day) => {
          const dayInfo = weekData[day];
          if (!dayInfo) {
            // If day not defined in plan => show placeholder
            return (
              <div key={day} className="day-card">
                <h3 className="day-title">{day}</h3>
                <p className="day-type">Aucune donnée</p>
              </div>
            );
          }

          const { distance, type, pace, notes } = dayInfo;
          return (
            <div key={day} className="day-card">
              <h3 className="day-title">{day}</h3>
              <p className="day-type">{type}</p>
              {distance > 0 && (
                <p className="day-distance">
                  {distance} km {pace && <span className="day-pace">({pace})</span>}
                </p>
              )}
              {distance === 0 && <p className="day-distance">Repos</p>}
              {notes && notes !== "" && <p className="day-notes">{notes}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPlan;
