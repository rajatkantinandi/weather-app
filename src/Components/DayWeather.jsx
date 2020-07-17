import React from 'react';

export default function DayWeather(props) {
  const { day, temp, unit, weather } = props;

  return (
    <div className="weekday">
      <h3>{day}</h3>
      <div className="data">
        <span className="arrow up"></span>
        {temp[0]}
        <span className="unit">{unit}</span>
      </div>
      <div className="data">
        <span className="arrow down"></span>
        {temp[1]}
        <span className="unit">{unit}</span>
      </div>
      <div className="weather data">{weather}</div>
    </div>
  );
}
