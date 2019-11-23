import React, { useState } from 'react';

export default function WeatherNow({ temp, unit, weather, temps, setUpcomingFilter, mainTransform, setTransform, aqi, cityName }) {
    const [comingBtnDisplay, setComingBtnDisplay] = useState(null);

    function handleComing() {
        setTransform('translateY(-135px)');
        setComingBtnDisplay('none');
        setUpcomingFilter('blur(0px)');
    }

    return (
        <section className="weather-today" style={{ transform: mainTransform }}>
            <h2>Now</h2>
            <h2>{temp} {unit}</h2>
            <h2>{weather.description}</h2>
            <h3><span className="arrow up"></span>
                Max: {temps[0][0]} {unit} &nbsp;
        <span className="arrow down"></span>
                Min: {temps[0][1]} {unit}
            </h3>
            <h4>Humidity: {weather.humidity}%, Wind Speed: {weather.windSpeed}m/s</h4>
            {aqi && <h4>AQI({cityName}): <span className={'aqi ' + getAQIClass(aqi)}>{aqi}</span></h4>}
            <button className="show-coming" onClick={handleComing} style={{ display: comingBtnDisplay }}>Show Next Days</button>
        </section>
    )
}

function getAQIClass(aqi) {
    if (aqi <= 50) {
        return 'green';
    }
    else if (aqi <= 100) {
        return 'yellow';
    }
    else if (aqi <= 150) {
        return 'orange';
    }
    else if (aqi <= 200) {
        return 'red';
    }
    else if (aqi <= 300) {
        return 'indigo';
    }
    else if (aqi > 300) {
        return 'maroon';
    }
}