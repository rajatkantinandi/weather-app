import React from 'react';
import { clearCacheAndRefresh } from '../hooks/useVersionInfo';

export default function AppUpdateBanner() {
  return (
    <div className="updateBanner">
      The app is out of date &amp; please click the "Refresh Now" button to have a better experience.
      <button onClick={clearCacheAndRefresh} className="refresh-btn">
        Refresh Now
      </button>
    </div>
  );
}
