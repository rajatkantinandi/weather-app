import { useEffect, useState } from 'react';
import { fromKtoC, fromKtoF } from '../helpers/tempHelper';
import { API_ID } from '../constants/api';

const useFetchTemp = (unit) => {
  const [temp, setTemp] = useState('---');
  const [temps, setTemps] = useState([['--', '--'], ['--', '--'], ['--', '--'], ['--', '--'], ['--', '--'], null]);
  const [comingWeather, setComingWeather] = useState(['--', '--', '--', '--', '--']);
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem('location')) || null);
  const [locationName, setLocationName] = useState('------');
  const [weather, setWeather] = useState({
    description: '-------',
    windSpeed: '---',
    humidity: '--',
    id: 0,
  });

  // Initialize geolocation & get lat & long
  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        //Get Location & Link
        const locationToSet = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };

        setLocation(locationToSet);
        localStorage.setItem('location', JSON.stringify(locationToSet));
      });
    } catch (e) {
      alert('Enable location on your browser');
    }
  }, []);

  // Fetch the weather when location is updated
  useEffect(() => {
    if (location) {
      setCombinedTemps(unit, location, setLocationName, setWeather, setComingWeather, setTemps, setTemp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return [temp, temps, location, locationName, weather, comingWeather, setTemp, setTemps];
};

const setCombinedTemps = async (unit, location, setLocationName, setWeather, setComingWeather, setTemps, setTemp) => {
  let { temp, temp_max, temp_min, locationName, weather } = await fetchTemp(location);
  let { comingTemps, comingWeather } = await fetchComingTemp(location);
  comingTemps[0][0] = Math.max(temp_max, comingTemps[0][0]);
  comingTemps[0][1] = Math.min(temp_min, comingTemps[0][1]);
  setLocationName(locationName);
  setWeather(weather);
  setTemp(getTempInUnit(unit, temp));
  setComingWeather(comingWeather);
  setTemps(comingTemps.map((temps) => temps.map((temp) => getTempInUnit(unit, temp))));
};

const getTempInUnit = (unit, tempInK) => {
  if (unit === 'C') return fromKtoC(tempInK);
  if (unit === 'F') return fromKtoF(tempInK);
};

// Fetch weather from API
const fetchTemp = async (location) => {
  const API_URL =
    'https://api.openweathermap.org/data/2.5/weather?lat=' +
    location.lat +
    '&lon=' +
    location.long +
    '&appid=' +
    API_ID;
  let result = null;
  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem('temp-data', JSON.stringify(result));
  } catch (e) {
    document.querySelector('.container').classList.add('offline');
    result = JSON.parse(localStorage.getItem('temp-data'));
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
      locationName: name + ', ' + sys.country,
      weather: { description: description.toUpperCase(), windSpeed, humidity, id },
    };
  } else return null;
};

// Fetch  Upcoming weather from API
const fetchComingTemp = async (location) => {
  const API_URL =
    'https://api.openweathermap.org/data/2.5/forecast?lat=' +
    location.lat +
    '&lon=' +
    location.long +
    '&appid=' +
    API_ID;
  let result = null;
  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem('coming-temp-data', JSON.stringify(result));
  } catch (e) {
    result = JSON.parse(localStorage.getItem('coming-temp-data'));
  }
  if (result) {
    const comingTemps = [];
    const comingWeather = [];
    for (let i = 1; i <= 5; i++) {
      let tempsOfTheDay = result.list
        .slice(8 * (i - 1), 8 * i)
        .map(({ main: { temp_max, temp_min } }) => [temp_max, temp_min]);
      const maxTemps = tempsOfTheDay.map((temp) => temp[0]);
      const minTemps = tempsOfTheDay.map((temp) => temp[1]);
      comingTemps.push([Math.max(...maxTemps), Math.min(...minTemps)]);
      comingWeather.push(result.list[8 * (i - 1)].weather[0].main);
    }
    comingTemps.push([]);
    return { comingTemps, comingWeather };
  }
};

export default useFetchTemp;
