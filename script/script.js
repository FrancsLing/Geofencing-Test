import { initGeofenceMap } from './geofence-map.js';
import { initLocationCheck } from './location-check.js';

const geofence = initGeofenceMap();
initLocationCheck(() => ({
  center: geofence.getCenter(),
  radius: geofence.getRadius(),
}));
