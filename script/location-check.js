import { getDistanceInMeters, getProximityStatus } from './distance.js';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

const GEOLOCATION_ERROR_MESSAGES = {
  1: 'Allow location access in your browser settings, then try again.',
  2: 'Your device could not determine its location. Try somewhere with a clearer signal.',
  3: 'Location took too long. Please try again.',
};

function renderResult(result, title, detail, statusClass = '') {
  const heading = document.createElement('strong');
  heading.textContent = title;
  const description = document.createElement('span');
  description.textContent = detail;
  result.className = statusClass;
  result.replaceChildren(heading, description);
}

function setButtonState(button, isLoading, label) {
  button.disabled = isLoading;
  button.textContent = label;
}

/** Attach the geolocation check behavior to the page button. */
export function initLocationCheck(getGeofence) {
  const button = document.querySelector('#check');
  const result = document.querySelector('#result');

  function handleLocationSuccess({ coords }) {
    const { center, radius } = getGeofence();
    const userCoords = { lat: coords.latitude, lon: coords.longitude };
    const distance = getDistanceInMeters(userCoords, center);
    const accuracy = coords.accuracy;
    const status = getProximityStatus(distance, accuracy, radius);
    const roundedDistance = Math.round(distance);
    const roundedAccuracy = Math.round(accuracy);
    const distanceDetail = `About ${roundedDistance} m away. GPS accuracy: ±${roundedAccuracy} m.`;
    const statusContent = {
      near: { title: `You're within the ${radius} m geofence`, detail: distanceDetail },
      far: { title: `You're outside the ${radius} m geofence`, detail: distanceDetail },
      uncertain: {
        title: 'Location is too uncertain',
        detail: `About ${roundedDistance} m away, with ±${roundedAccuracy} m accuracy. Move somewhere with a clearer signal and check again.`,
      },
    };
    const { title, detail } = statusContent[status];
    renderResult(result, title, detail, status);
    setButtonState(button, false, 'Check again');
  }

  function handleLocationError(error) {
    const message = GEOLOCATION_ERROR_MESSAGES[error.code] || 'Please check your browser settings and try again.';
    renderResult(result, "Couldn't check location", message);
    setButtonState(button, false, 'Try again');
  }

  function checkLocation() {
    result.className = '';
    if (!navigator.geolocation) {
      renderResult(result, 'Location unavailable', 'This browser does not support location checks.');
      return;
    }
    setButtonState(button, true, 'Checking…');
    result.textContent = 'Waiting for your location…';
    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, GEOLOCATION_OPTIONS);
  }

  button.addEventListener('click', checkLocation);
}
