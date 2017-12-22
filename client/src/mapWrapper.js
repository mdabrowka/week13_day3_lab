
var GoogleMapsLoader = require('google-maps');

var MapWrapper = function (container, coords, zoom, whenmaploaded) {
  GoogleMapsLoader.load(function(google){
    this.google = google;
    this.googleMap = new google.maps.Map(container, {
      center: coords,
      zoom: zoom
    });
    this.markers = [];

    //This executes in callback for the laod method
    //So if it hits, the map is laoded
    whenmaploaded();

  }.bind(this));
}



MapWrapper.prototype.addMarker = function (coords) {

  console.log(this.google);
  var marker = new this.google.maps.Marker({
    position: coords,
    map: this.googleMap
  });
  this.markers.push(marker)
}

MapWrapper.prototype.addClickEvent = function () {
  this.googleMap.addListener('click', function (event) {
    var position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    this.addMarker(position);
  }.bind(this));
}

MapWrapper.prototype.bounceMarkers = function () {
  this.markers.forEach(function (marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  })
}


module.exports = MapWrapper;
