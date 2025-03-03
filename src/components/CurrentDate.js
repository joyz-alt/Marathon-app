import React, { useState, useEffect } from 'react';


const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('fr-FR', options));
  }, []);

  return (
    <p id="current-date">{currentDate}</p>
  );
};

export default CurrentDate;
