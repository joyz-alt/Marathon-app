import React from "react";

const Sponsors = () => {
  return (
    <footer className="footer-container">
      <h2>🍻 Sponsors Officiels 🍻</h2>
      <div className="sponsor-logos">
        <div className="sponsor">
          <img src="/images/vanb.png" alt="Logo V&B" />
          <p>La vraie hydratation commence après la ligne d’arrivée ! 🍷🍺</p>
        </div>
        <div className="sponsor">
          <img src="/images/PMU.png" alt="Logo PMU" />
          <p>Pariez sur vous-même… mais pas comme au PMU ! 🐎🍹</p>
        </div>
      </div>
    </footer>
  );
};

export default Sponsors;
