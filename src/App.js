import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import DayWeather from './Components/DayWeather';
import { fromCtoF, fromFtoC } from './helpers/tempHelper';
import useFetchTemp from './hooks/useFetchTemp';
import useBgImageURL from './hooks/useBgImageURL';

const { useState, Fragment } = React;

// Don't use this go to OpenWeatherMap.org & get yours for free, after free sign up. 
// They have maximum usage limits so kindly don't use mine.

export default function App(props) {
  const [unit, setUnit] = useState(localStorage.getItem('unit') || '˚C');
  const [temp, temps, location, locationName, weather, comingWeather, setTemp, setTemps] = useFetchTemp(unit);
  const bgImageURL = useBgImageURL(weather.id);
  const [mainTransform, setTransform] = useState(null);
  const [comingBtnDisplay, setComingBtnDisplay] = useState(null);
  const [upcomingFilter, setUpcomingFilter] = useState(null);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days = [...days, ...days];
  const today = new Date().getDay();
  days = days.slice(today + 1, today + 5);

  const handleUnitChange = () => {
    if (temp !== '---') {
      if (unit === '˚C') {
        setUnit('˚F');
        localStorage.setItem('unit', '˚F');
        setTemps(temps.map(temps => temps.map(temp => fromCtoF(temp))));
        setTemp(fromCtoF(temp));
      } else {
        setUnit('˚C');
        localStorage.setItem('unit', '˚C');
        setTemps(temps.map(temps => temps.map(temp => fromFtoC(temp))));
        setTemp(fromFtoC(temp));
      }
    }
  }

  const handleComing = () => {
    setTransform('translateY(-135px)');
    setComingBtnDisplay('none');
    setUpcomingFilter('blur(0px)');
  }

  return <Fragment>
    <Header {...{ locationName, unit, handleUnitChange }} />
    <main style={{ background: bgImageURL }}>
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
        <button className="show-coming" onClick={handleComing} style={{ display: comingBtnDisplay }}>Show Next Days</button>
      </section>
      <section className="weather-coming" style={{ filter: upcomingFilter, transform: mainTransform }}>
        <h2>This Week</h2>
        <div className="days">
          {days.map((day, idx) => <DayWeather {...{ day, unit }} temp={temps[idx + 1]} weather={comingWeather[idx + 1]} key={idx} />)}
        </div>
      </section>
    </main>
    <Footer {...{ location, handleComing, comingBtnDisplay }} />
  </Fragment>;
}