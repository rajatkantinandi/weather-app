import React from 'react';

export default function DayWeather(props) {
    const { day, temp, unit, weather } = props;

    return <div className="weekday">
        <h3>{day}</h3>
        <h5>{temp} {unit}</h5>
        <h5>{weather}</h5>
    </div>;
}