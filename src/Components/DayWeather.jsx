import React from 'react';

export default function DayWeather(props) {
  const { day, temp, unit, weather } = props;

  return (
    <div className="weekday">
      <h3>{day}</h3>
      <h5>
        <span className="arrow up"></span>
        {temp[0]}
        <span className="unit">{unit}</span>
      </h5>
      <h5>
        <span className="arrow down"></span>
        {temp[1]}
        <span className="unit">{unit}</span>
      </h5>
      <h4 className="weather">{weather}</h4>
    </div>
  );
}
