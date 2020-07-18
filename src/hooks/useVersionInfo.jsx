import { useEffect, useState } from 'react';

export default function useVersionInfo() {
  const [isUpToDate, setIsUpToDate] = useState(true);

  useEffect(() => {
    if (wasUpToDate()) {
      fetch('/version.json')
        .then((versionJSON) => versionJSON.json())
        .then((versionString) => {
          const localVersion = getLocalVersion();
          if (versionString !== localVersion) {
            console.log('## The app is out of date & needs update!');
            setIsUpToDate(false);
            localStorage.setItem('wasUpToDate', false);
          } else {
            localStorage.setItem('wasUpToDate', true);
            setIsUpToDate(true);
          }

          localStorage.setItem('version', versionString);
        })
        .catch((err) => {
          console.log('App offline, assuming up to date');
        });
    } else {
      clearCacheAndRefresh();
    }
  }, []);

  return { isUpToDate };
}

function getLocalVersion() {
  return localStorage.getItem('version') || '';
}

function wasUpToDate() {
  return localStorage.getItem('wasUpToDate') === false ? false : true;
}

export function clearCacheAndRefresh() {
  const currentVersion = getLocalVersion();
  localStorage.clear();
  localStorage.setItem('version', currentVersion);
  window.location.reload();
}
