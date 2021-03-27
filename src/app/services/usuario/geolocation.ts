export class Geolocation {

  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;

  constructor(coords: GeolocationCoordinates) {
    this.accuracy = coords.accuracy;
    this.altitude = coords.altitude;
    this.altitudeAccuracy = coords.altitudeAccuracy;
    this.heading = coords.heading;
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    this.speed = coords.speed;
  }

}
