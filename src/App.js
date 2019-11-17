import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import WeatherNow from './Components/WeatherNow';
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
  const [upcomingFilter, setUpcomingFilter] = useState(null);
  const [mainTransform, setTransform] = useState(null);

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

  return <Fragment>
    <Header {...{ locationName, unit, handleUnitChange }} />
    <main style={{ background: bgImageURL }}>
      <WeatherNow {...{ temp, temps, unit, weather, setUpcomingFilter, mainTransform, setTransform }} />
      <section className="weather-coming" style={{ filter: upcomingFilter, transform: mainTransform }}>
        <h2>This Week</h2>
        <div className="days">
          {days.map((day, idx) => <DayWeather {...{ day, unit }} temp={temps[idx + 1]} weather={comingWeather[idx + 1]} key={idx} />)}
        </div>
      </section>
    </main>
    <Footer {...{ location }} />
  </Fragment>;
}