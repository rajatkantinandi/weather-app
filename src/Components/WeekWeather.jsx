import React from 'react';
import DayWeather from './DayWeather';

let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
days = [...days, ...days];
const today = new Date().getDay();
days = days.slice(today + 1, today + 5);

export default function WeekWeather({ unit, temps, comingWeather, upcomingFilter, mainTransform }) {
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
