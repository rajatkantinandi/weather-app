import React from 'react';
import DayWeather from './DayWeather';

function getDays(updateDate) {
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days = [...days, ...days];
  let today = new Date().getDay();

  if (updateDate) {
    today = new Date(updateDate).getDay();
  }

  return days.slice(today + 1, today + 5);
}

export default function WeekWeather({ unit, temps, comingWeather, upcomingFilter, mainTransform, updateDate }) {
  const days = getDays(updateDate);

  return (
    <section className="weather-coming" style={{ filter: upcomingFilter, transform: mainTransform }}>
      <h2>This Week</h2>
      <div className="days">
        {days.map((day, idx) => (
          <DayWeather {...{ day, unit }} temp={temps[idx + 1]} weather={comingWeather[idx + 1]} key={idx} />
        ))}
      </div>
    </section>
  );
}
