const DEFAULT_CENTER = { lat: 10.720788860167113, lon: 123.81709348927583 };
const DEFAULT_RADIUS = 30;
const STORAGE_KEY = 'nearby-check-geofence';

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lon) &&
      Number.isFinite(saved.radius) && saved.lat >= -90 && saved.lat <= 90 &&
      saved.lon >= -180 && saved.lon <= 180) {
      return {
        center: { lat: saved.lat, lon: saved.lon },
        radius: Math.min(1000, Math.max(10, saved.radius)),
      };
    }
  } catch {
    // Use the default settings if saved browser data is unavailable or invalid.
  }
  return { center: DEFAULT_CENTER, radius: DEFAULT_RADIUS };
}

function saveSettings(center, radius) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...center, radius }));
  } catch {
    // The map still works if browser storage is unavailable.
  }
}

/** Set up the map, location marker, radius control, and saved geofence settings. */
export function initGeofenceMap() {
  const radiusInput = document.querySelector('#radius');
  const radiusValue = document.querySelector('#radius-value');
  const coordinates = document.querySelector('#coordinates');
  const mapLink = document.querySelector('#map-link');
  const settings = loadSettings();
  let center = settings.center;
  let radius = settings.radius;

  radiusInput.value = radius;
  const map = L.map('map').setView([center.lat, center.lon], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker([center.lat, center.lon]).addTo(map);
  const circle = L.circle([center.lat, center.lon], {
    radius,
    color: '#237447',
    fillColor: '#53a56c',
    fillOpacity: 0.2,
    weight: 2,
  }).addTo(map);

  function updateCenter(lat, lon) {
    center = { lat, lon };
    marker.setLatLng([lat, lon]);
    circle.setLatLng([lat, lon]);
    coordinates.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    mapLink.href = `https://maps.google.com/?q=${lat},${lon}`;
    saveSettings(center, radius);
  }

  function updateRadius(value) {
    radius = Number(value);
    radiusValue.value = `${radius} m`;
    radiusValue.textContent = `${radius} m`;
    circle.setRadius(radius);
    saveSettings(center, radius);
  }

  map.on('click', ({ latlng }) => updateCenter(latlng.lat, latlng.lng));
  radiusInput.addEventListener('input', () => updateRadius(radiusInput.value));
  updateCenter(center.lat, center.lon);
  updateRadius(radius);

  return {
    getCenter: () => ({ ...center }),
    getRadius: () => radius,
  };
}
