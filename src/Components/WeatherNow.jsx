import React, { useState } from 'react';

export default function WeatherNow({
  temp,
  unit,
  weather,
  temps,
  setUpcomingFilter,
  mainTransform,
  setTransform,
  aqi,
  cityName,
}) {
  const [comingBtnDisplay, setComingBtnDisplay] = useState(null);

  function handleComing() {
    setTransform('translateY(-135px)');
    setComingBtnDisplay('none');
    setUpcomingFilter('blur(0px)');
  }

  return (
    <section className="weather-today" style={{ transform: mainTransform }}>
      <h2>Now</h2>
      <div className="todaysHighlight data">
        {temp}
        <span className="unit">{unit}</span>
      </div>
      <div className="todaysHighlight data">{weather.description}</div>
      <div className="maxMin dataBlock">
        <span>
          <span className="arrow up"></span>
          <h3>Max:</h3>{' '}
          <span className="data">
            {temps[0][0]}
            <span className="unit">{unit}</span>
          </span>
        </span>
        <span>
          <span className="arrow down"></span>
          <h3>Min:</h3>{' '}
          <span className="data">
            {temps[0][1]}
            <span className="unit">{unit}</span>
          </span>
        </span>
      </div>
      <div className="misc dataBlock">
        <span>
          <h3>Humidity:</h3> <span className="data">{weather.humidity}%</span>
        </span>
        <span>
          <h3>Wind Speed:</h3> <span className="data">{weather.windSpeed}m/s</span>
        </span>
      </div>
      {aqi && (
        <div className="aqiData dataBlock">
          <div>
            <h3>Air Quality Index:</h3> <span className={'aqi ' + getAQIClass(aqi)}>{aqi}</span>
          </div>
          <div className="dataBlock">({cityName})</div>
        </div>
      )}
      <button className="show-coming" onClick={handleComing} style={{ display: comingBtnDisplay }}>
        Show Next Days
      </button>
    </section>
  );
}

function getAQIClass(aqi) {
  if (aqi <= 50) {
    return 'green';
  } else if (aqi <= 100) {
    return 'yellow';
  } else if (aqi <= 150) {
    return 'orange';
  } else if (aqi <= 200) {
    return 'red';
  } else if (aqi <= 300) {
    return 'indigo';
  } else if (aqi > 300) {
    return 'maroon';
  }
}
