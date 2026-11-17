# Nearby Check

A small phone friendly geofence checker for the saved point at `10.720788860167113, 123.81709348927583`.

Open the [live app](https://francsling.github.io/Geofencing-Test/) on your phone, tap **Check my location**, and allow location access. The app compares your position with the 30 meter radius and includes your device's estimated GPS accuracy. If the accuracy range overlaps the boundary, it reports that the result is uncertain.

Location is checked in your browser and is not sent to a server. Browser location access requires HTTPS; GitHub Pages provides it for the live app.

The app is a static page in `index.html`. Pushes to `main` deploy automatically through `.github/workflows/pages.yml`.
