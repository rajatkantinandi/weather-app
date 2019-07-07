import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import DayWeather from './Components/DayWeather';

const { useState, useEffect, Fragment } = React;

// Don't use this go to OpenWeatherMap.org & get yours for free, after free sign up. 
// They have maximum usage limits so kindly don't use mine.
const API_ID = "133daa16c23326f2af0d1603063dfea5";

export default function App(props) {
  const [unit, setUnit] = useState(localStorage.getItem('unit') || '˚C');
  const [temps, location, locationName, weather, setTemp] = useFetchtemp(unit);
  const [bgImageURL, setBgImageURL] = useState("lightgray");
  const [comingTemps, comingWeather, setComingTemp] = useComingTemp(unit, location);
  const [mainTransform, setTransform] = useState(null);
  const [comingBtnDisplay, setComingBtnDisplay] = useState(null);
  const [upcomingFilter, setUpcomingFilter] = useState(null);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days = [...days, ...days];
  const today = new Date().getDay();
  days = days.slice(today + 1, today + 5);

  const handleUnitChange = () => {
    if (temps[3]) {
      if (unit === '˚C') {
        setUnit('˚F');
        localStorage.setItem('unit', '˚F');
        setTemp(fromCtoF(temps));
      } else {
        setUnit('˚C');
        localStorage.setItem('unit', '˚C');
        setTemp(fromFtoC(temps));
      }
    }
    if (comingTemps[4]) {
      if (unit === '˚C') {
        setComingTemp(fromCtoF(comingTemps));
      } else {
        setComingTemp(fromFtoC(comingTemps));
      }
    }
  }

  const handleComing = () => {
    setTransform('translateY(-135px)');
    setComingBtnDisplay('none');
    setUpcomingFilter('blur(0px)');
  }

  // Change background Image
  useEffect(() => {
    if (weather.id !== 0) {
      let baseImageURL = process.env.PUBLIC_URL + "/images/backgrounds/";
      const imgid = weather.id;
      if (imgid >= 200 && imgid < 300) {
        setBgImageURL("url(" + baseImageURL + "thunderstorm.jpg)");
      }
      else if (imgid >= 300 && imgid < 400) {
        setBgImageURL("url(" + baseImageURL + "drizzle.jpg)");
      }
      else if (imgid >= 500 && imgid < 600) {
        setBgImageURL("url(" + baseImageURL + "rain.jpg)");
      }
      else if (imgid >= 600 && imgid < 700) {
        setBgImageURL("url(" + baseImageURL + "snow.jpg)");
      }
      else if (imgid >= 700 && imgid < 800) {
        setBgImageURL("url(" + baseImageURL + "atmosphere.jpg)");
      }
      else if (imgid === 800) {
        setBgImageURL("url(" + baseImageURL + "clear.jpg)");
      }
      else if (imgid > 800 && imgid < 900) {
        setBgImageURL("url(" + baseImageURL + "cloudy.jpg)");
      }
      if (imgid >= 900) {
        setBgImageURL("url(" + baseImageURL + "tornado.jpg)");
      }
    }
  }, [weather]);

  return <Fragment>
    <Header {...{ locationName, unit, handleUnitChange }} />
    <main style={{ background: bgImageURL }}>
      <section className="weather-today" style={{ transform: mainTransform }}>
        <h2>Today</h2>
        <h2>{temps[0]} {unit}</h2>
        <h2>{weather.description}</h2>
        <h3>Max: {temps[1]} {unit} &amp; Min: {temps[2]} {unit}</h3>
        <h4>Humidity: {weather.humidity}%, Wind Speed: {weather.windSpeed}m/s</h4>
        <button className="show-coming" onClick={handleComing} style={{ display: comingBtnDisplay }}>Show Upcoming</button>
      </section>
      <section className="weather-coming" style={{ filter: upcomingFilter, transform: mainTransform }}>
        <h2>UpComing</h2>
        <div className="days">
          {days.map((day, idx) => <DayWeather {...{ day, unit }} temp={comingTemps[idx]} weather={comingWeather[idx]} key={idx} />)}
        </div>
      </section>
    </main>
    <Footer {...{ location, handleComing, comingBtnDisplay }} />
  </Fragment>;
}

const useFetchtemp = (unit) => {
  const [temps, setTemp] = useState(["---", "---", "---", false]);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('------');
  const [weather, setWeather] = useState({
    description: '-------',
    windSpeed: '---',
    humidity: '--',
    id: 0
  });

  // Initialize geolocation & get lat & long
  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        //Get Location & Link
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          name: null
        });
      });
    }
    catch (e) {
      alert("Enable location on your browser");
    }
  }, []);

  // Fetch the weather when location is updated
  useEffect(() => {
    if (location) {
      fetchTemp(location, unit, setTemp, setLocationName, setWeather);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])
  return [temps, location, locationName, weather, setTemp];
}

// Fetch weather from API
const fetchTemp = async (location, unit, setTemp, setLocationName, setWeather) => {
  const API_URL = "https://api.openweathermap.org/data/2.5/weather?lat=" + location.lat + "&lon=" + location.long + "&appid=" + API_ID;
  let result = null;
  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem("temp-data", JSON.stringify(result));
  }
  catch (e) {
    document.querySelector(".container").classList.add("offline");
    result = JSON.parse(localStorage.getItem("temp-data"));
  }
  if (result) {
    const { temp, temp_max, temp_min, humidity } = result.main;
    const { name, sys, weather, wind } = result;
    const { description, id } = weather[0];
    const windSpeed = wind.speed;
    setLocationName(name + ", " + sys.country);
    setWeather({ description: description.toUpperCase(), windSpeed, humidity, id });
    if (unit === '˚C') setTemp(fromKtoC([temp, temp_max, temp_min, true]));
    else return setTemp(fromKtoF([temp, temp_max, temp_min, true]));
  }
  else return null;
}

const useComingTemp = (unit, location) => {
  const [comingTemp, setComingTemp] = useState(['--', '--', '--', '--', false]);
  const [comingWeather, setComingWeather] = useState(['--', '--', '--', '--']);

  useEffect(() => {
    if (location) {
      fetchComingTemp(unit, location, setComingTemp, setComingWeather);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return [comingTemp, comingWeather, setComingTemp];
}

// Fetch  Upcoming weather from API
const fetchComingTemp = async (unit, location, setComingTemp, setComingWeather) => {
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + location.lat + "&lon=" + location.long + "&appid=" + API_ID;
  let result = null;
  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem("coming-temp-data", JSON.stringify(result));
  }
  catch (e) {
    result = JSON.parse(localStorage.getItem("coming-temp-data"));
  }
  if (result) {
    const temps = [];
    const weather = [];
    for (let i = 1; i < 5; i++) {
      temps.push(result.list[8 * i].main.temp);
      weather.push(result.list[8 * i].weather[0].main);
    }
    temps.push(true);
    if (unit === '˚C') setComingTemp(fromKtoC(temps));
    else setComingTemp(fromKtoF(temps));
    setComingWeather(weather);
  }
}

const fromKtoC = (temps) => temps.map(temp => (temp - 273).toFixed(1));
const fromKtoF = (temps) => temps.map(temp => ((temp - 273) * 1.8 + 32).toFixed(1));


const fromCtoF = (temps) => temps.map(temp => (1.8 * temp + 32).toFixed(1));
const fromFtoC = (temps) => temps.map(temp => ((temp - 32) / 1.8).toFixed(1));
