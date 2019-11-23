import { useEffect, useState } from 'react';
import { AQI_API_ID } from '../constants/api';
import { truncate } from '../helpers/commonHelper';

export default function useAQI(location) {
    const [data, setData] = useState({ data: { aqi: null, city: { name: null } } });

    useEffect(() => {
        fetchAQI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const fetchAQI = async () => {
        const url = `https://api.waqi.info/feed/geo:${location.lat};${location.long}/?token=${AQI_API_ID}`;
        let result;

        try {
            const response = await fetch(url);
            result = await response.json();
            localStorage.setItem("aqi-data", JSON.stringify(result));
        }
        catch (e) {
            result = JSON.parse(localStorage.getItem("aqi-data"));
        }

        if (result) setData(result);
    }

    const { data: { aqi, city: { name } } } = data;

    return { aqi, cityName: truncate(name, 30) };
}