import React, { useEffect } from "react";

const WelcomeMessage = ({ username }) => {
  useEffect(() => {
    console.log("📢 WelcomeMessage received username:", username);
  }, [username]);

  return (
    <div className="welcome-container">
      <h2>👋 Bienvenue, {username} !</h2>
      <p className="app-description">
        Cette application vous permet de suivre mon programme d'entraînement pour le marathon. 
        Sélectionnez une semaine et un jour pour voir mon plan d'entraînement détaillé. 
        N'hésitez pas à laisser des commentaires pour me motiver 💪 ou proposer des ajouts à l'application ! 🚀
      </p>
    </div>
  );
};

export default WelcomeMessage;
