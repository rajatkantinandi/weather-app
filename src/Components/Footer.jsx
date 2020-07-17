import React from 'react';

export default function Footer(props) {
  const { location } = props;

  return (
    <footer>
      {location ? (
        <div>
          Latitude: {location.lat.toFixed(3)}, Longitude: {location.long.toFixed(3)}
        </div>
      ) : (
        'Latitude: ..., Longitude: ...'
      )}
      <div>
        Using{' '}
        <a href="https://api.openweathermap.org" target="_blank" rel="noreferrer noopener">
          Openweathermap.org
        </a>{' '}
        &amp;{' '}
        <a href="https://aqicn.org/api/" target="_blank" rel="noreferrer noopener">
          aqicn.org
        </a>{' '}
        API
      </div>
    </footer>
  );
}
