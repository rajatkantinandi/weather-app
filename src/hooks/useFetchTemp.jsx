import { useEffect, useState } from 'react';
import { fromKtoC, fromKtoF } from '../helpers/tempHelper';
import { API_ID } from '../constants/api';
import { padZero } from '../helpers/commonHelper';

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
  const [updateDate, setUpdateDate] = useState(localStorage.getItem('updateDate') || null);
  const [updateTime, setUpdateTime] = useState(localStorage.getItem('updateTime') || null);
  const [isUpdating, setIsUpdating] = useState(true);

  // Fetch the weather from localStorage if localStorage has location & data
  useEffect(() => {
    if (location) {
      getCombinedTemps({}, true).then((tempData) => setTempData(tempData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      // Initialize geolocation & get lat & long
      navigator.geolocation.getCurrentPosition(function (position) {
        //Get Location & Link
        const locationToSet = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };

        setLocation(locationToSet);
        localStorage.setItem('location', JSON.stringify(locationToSet));
        // Fetch data from api based on updated location
        setIsUpdating(true);
        getCombinedTemps(location).then((tempData) => {
          setTempData(tempData);
          setIsUpdating(false);

          if (tempData.locationName && tempData.comingWeather) {
            // update date set as new data is fetched
            const now = new Date();
            const time = padZero(now.getHours()) + ':' + padZero(now.getMinutes());
            const date = now.toDateString();
            setUpdateDate(date);
            setUpdateTime(time);
            localStorage.setItem('updateDate', date);
            localStorage.setItem('updateTime', time);
          }
        });
      });
    } catch (e) {
      alert('Enable location on your browser');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setTempData({ locationName, weather, temp, comingWeather, comingTemps }) {
    if (locationName) {
      setLocationName(locationName);
      setWeather(weather);
      setTemp(getTempInUnit(unit, temp));
    }
    if (comingWeather) {
      setComingWeather(comingWeather);
      setTemps(comingTemps.map((temps) => temps.map((temp) => getTempInUnit(unit, temp))));
    }
  }

  return {
    temp,
    temps,
    location,
    locationName,
    weather,
    comingWeather,
    setTemp,
    setTemps,
    updateDate,
    isUpdating,
    updateTime,
  };
};

const getCombinedTemps = async (location, fromLocalStorage) => {
  let { temp, temp_max, temp_min, locationName, weather } = await fetchTemp(location, fromLocalStorage);
  let { comingTemps, comingWeather } = await fetchComingTemp(location, fromLocalStorage);

  if (comingTemps) {
    comingTemps[0][0] = Math.max(temp_max, comingTemps[0][0]);
    comingTemps[0][1] = Math.min(temp_min, comingTemps[0][1]);
  }

  return { locationName, weather, temp, comingWeather, comingTemps };
};

const getTempInUnit = (unit, tempInK) => {
  if (unit === 'C') return fromKtoC(tempInK);
  if (unit === 'F') return fromKtoF(tempInK);
};

// Fetch weather from API
const fetchTemp = async (location, fromLocalStorage) => {
  let result = null;

  if (fromLocalStorage) {
    result = JSON.parse(localStorage.getItem('temp-data'));
    return parseCurrentWeatherFromResponse(result);
  }

  const API_URL =
    'https://api.openweathermap.org/data/2.5/weather?lat=' +
    location.lat +
    '&lon=' +
    location.long +
    '&appid=' +
    API_ID;

  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem('temp-data', JSON.stringify(result));
  } catch (e) {
    document.querySelector('.container').classList.add('offline');
  }

  return parseCurrentWeatherFromResponse(result);
};

function parseCurrentWeatherFromResponse(resp) {
  if (resp) {
    const { temp, temp_max, temp_min, humidity } = resp.main;
    const { name, sys, weather, wind } = resp;
    const { description, id } = weather[0];
    const windSpeed = wind.speed;

    return {
      temp,
      temp_max,
      temp_min,
      locationName: name + ', ' + sys.country,
      weather: { description: description.toUpperCase(), windSpeed, humidity, id },
    };
  } else {
    return {};
  }
}

// Fetch  Upcoming weather from API
const fetchComingTemp = async (location, fromLocalStorage) => {
  let result = null;

  if (fromLocalStorage) {
    result = JSON.parse(localStorage.getItem('coming-temp-data'));
    return parseComingWeatherFromResponse(result);
  }

  const API_URL =
    'https://api.openweathermap.org/data/2.5/forecast?lat=' +
    location.lat +
    '&lon=' +
    location.long +
    '&appid=' +
    API_ID;

  try {
    const response = await fetch(API_URL);
    result = await response.json();
    localStorage.setItem('coming-temp-data', JSON.stringify(result));
  } catch (e) {
    // Offline
  }

  return parseComingWeatherFromResponse(result);
};

function parseComingWeatherFromResponse(resp) {
  if (resp) {
    const comingTemps = [];
    const comingWeather = [];

    for (let i = 1; i <= 5; i++) {
      let tempsOfTheDay = resp.list
        .slice(8 * (i - 1), 8 * i)
        .map(({ main: { temp_max, temp_min } }) => [temp_max, temp_min]);
      const maxTemps = tempsOfTheDay.map((temp) => temp[0]);
      const minTemps = tempsOfTheDay.map((temp) => temp[1]);
      comingTemps.push([Math.max(...maxTemps), Math.min(...minTemps)]);
      comingWeather.push(resp.list[8 * (i - 1)].weather[0].main);
    }

    comingTemps.push([]);

    return { comingTemps, comingWeather };
  } else {
    return {};
  }
}

export default useFetchTemp;
