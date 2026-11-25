const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/** Calculate great-circle distance between two { lat, lon } points. */
export function getDistanceInMeters(pointA, pointB) {
  const deltaLat = toRadians(pointB.lat - pointA.lat);
  const deltaLon = toRadians(pointB.lon - pointA.lon);
  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);
  const haversine = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

/** Account for GPS accuracy when deciding whether the user is inside the radius. */
export function getProximityStatus(distance, accuracy, radiusMeters) {
  const minDistance = Math.max(0, distance - accuracy);
  const maxDistance = distance + accuracy;
  if (maxDistance <= radiusMeters) return 'near';
  if (minDistance > radiusMeters) return 'far';
  return 'uncertain';
}
