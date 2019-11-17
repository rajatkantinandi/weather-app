import React from 'react';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import DayWeather from './Components/DayWeather';

const { useState, useEffect, Fragment } = React;

// Don't use this go to OpenWeatherMap.org & get yours for free, after free sign up. 
// They have maximum usage limits so kindly don't use mine.
const API_ID = "d3975ec650c9e4b83851dea60d799302";

export default function App(props) {
  const [unit, setUnit] = useState(localStorage.getItem('unit') || '˚C');
  const [temp, temps, location, locationName, weather, comingWeather, setTemp, setTemps] = useFetchtemp(unit);
  const [bgImageURL, setBgImageURL] = useState("lightgray");
  const [mainTransform, setTransform] = useState(null);
  const [comingBtnDisplay, setComingBtnDisplay] = useState(null);
  const [upcomingFilter, setUpcomingFilter] = useState(null);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days = [...days, ...days];
  const today = new Date().getDay();
  days = days.slice(today + 1, today + 5);

  const handleUnitChange = () => {
    if (temp!=='---') {
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

const useFetchtemp = (unit) => {
  const [temp,setTemp] = useState('---');
  const [temps, setTemps] = useState([['--', '--'], ['--', '--'], ['--', '--'], ['--', '--'], ['--', '--'], null]);
  const [comingWeather, setComingWeather] = useState(['--','--', '--', '--', '--']);
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem('location')) || null);
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
        const locationToSet = {
          lat: position.coords.latitude,
          long: position.coords.longitude
        };

        setLocation(locationToSet);
        localStorage.setItem('location', JSON.stringify(locationToSet));
      });
    }
    catch (e) {
      alert("Enable location on your browser");
    }
  }, []);

  // Fetch the weather when location is updated
  useEffect(() => {
    if (location) {
      setCombinedTemps(unit, location, setLocationName, setWeather, setComingWeather, setTemps, setTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])
  return [temp, temps, location, locationName, weather, comingWeather, setTemp, setTemps];
}

const setCombinedTemps = async (unit, location, setLocationName, setWeather, setComingWeather, setTemps, setTemp) => {
  let { temp, temp_max, temp_min, locationName, weather } = await fetchTemp(location);
  let { comingTemps, comingWeather } = await fetchComingTemp(location);
  comingTemps[0][0] = Math.max(temp_max,comingTemps[0][0]);
  comingTemps[0][1] = Math.min(temp_min,comingTemps[0][1]);
  setLocationName(locationName);
  setWeather(weather);
  setTemp(getTempInUnit(unit,temp));
  setComingWeather(comingWeather);
  setTemps(comingTemps.map(temps => temps.map(temp => getTempInUnit(unit,temp))));
}

const getTempInUnit = (unit,tempInK) => {
  if(unit==='˚C') return fromKtoC(tempInK);
  if(unit==='˚F') return fromKtoF(tempInK);
}

// Fetch weather from API
const fetchTemp = async (location) => {
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
    return {
      temp,
      temp_max,
      temp_min,
      locationName: name + ", " + sys.country,
      weather: { description: description.toUpperCase(), windSpeed, humidity, id }
    }
  }
  else return null;
}

// Fetch  Upcoming weather from API
const fetchComingTemp = async (location) => {
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
    const comingTemps = [];
    const comingWeather = [];
    for (let i = 1; i <= 5; i++) {
      let tempsOfTheDay = result.list.slice(8 * (i - 1), 8 * i)
        .map(({ main: { temp_max, temp_min } }) => ([temp_max, temp_min]));
      const maxTemps = tempsOfTheDay.map(temp => temp[0]);
      const minTemps = tempsOfTheDay.map(temp => temp[1]);
      comingTemps.push([Math.max(...maxTemps), Math.min(...minTemps)]);
      comingWeather.push(result.list[8 * (i - 1)].weather[0].main);
    }
    comingTemps.push([]);
    return { comingTemps, comingWeather };
  }
}

const fromKtoC = temp => (temp - 273).toFixed(1);
const fromKtoF = temp => ((temp - 273) * 1.8 + 32).toFixed(1);


const fromCtoF = temp => (1.8 * temp + 32).toFixed(1);
const fromFtoC = temp => ((temp - 32) / 1.8).toFixed(1);
