import { useEffect, useState } from 'react';

const useBgImageURL = (imgId) => {
    const [bgImageURL, setBgImageURL] = useState("lightgray");

    useEffect(() => {
        if (imgId) {
            let baseImageURL = process.env.PUBLIC_URL + "/images/backgrounds/";
            if (imgId >= 200 && imgId < 300) {
                setBgImageURL("url(" + baseImageURL + "thunderstorm.jpg)");
            }
            else if (imgId >= 300 && imgId < 400) {
                setBgImageURL("url(" + baseImageURL + "drizzle.jpg)");
            }
            else if (imgId >= 500 && imgId < 600) {
                setBgImageURL("url(" + baseImageURL + "rain.jpg)");
            }
            else if (imgId >= 600 && imgId < 700) {
                setBgImageURL("url(" + baseImageURL + "snow.jpg)");
            }
            else if (imgId >= 700 && imgId < 800) {
                setBgImageURL("url(" + baseImageURL + "atmosphere.jpg)");
            }
            else if (imgId === 800) {
                setBgImageURL("url(" + baseImageURL + "clear.jpg)");
            }
            else if (imgId > 800 && imgId < 900) {
                setBgImageURL("url(" + baseImageURL + "cloudy.jpg)");
            }
            if (imgId >= 900) {
                setBgImageURL("url(" + baseImageURL + "tornado.jpg)");
            }
        }
    }, [imgId]);

    return bgImageURL;
}

export default useBgImageURL;