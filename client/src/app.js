const Request = require('./services/request.js');
const CountryView = require('./views/countryView');
const MapWrapper = require('./mapWrapper');

let countryData = [];

const request = new Request("http://localhost:3000/api/countries")
const countryView = new CountryView();

var app = function(){
const url = "https://restcountries.eu/rest/v2/all";
makeRequest(url, requestComplete);

const saveCountryButton = document.querySelector('#save-country');
saveCountryButton.addEventListener('click', saveCountryButtonClicked)

const deleteButton = document.querySelector('#deleteButton');
deleteButton.addEventListener('click', deleteButtonClicked);
}


const makeRequest = function(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', callback);
};


const requestComplete = function() {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  countryData = JSON.parse(jsonString);
  const select = document.querySelector('#all-countries-list');
  select.addEventListener('change', function(){
    let selectedCountry = countryData[this.value];
  })
  populateDropDown(countryData);
}

const populateDropDown = function(country) {
  const dropDown = document.querySelector('#all-countries-list');
  country.forEach(function(country, index) {
    const option = document.createElement('option');
    option.value = index;
    // option.value = `${country.capital}, ${country.name}, region: ${country.region}`;
    option.innerText = country.name;
    dropDown.appendChild(option);
  })
}
//this is my post request where i am saving information
const saveCountryButtonClicked = function() {
  //this needs to be an index
  const countryValue = document.querySelector('#all-countries-list').value;
  const country = countryData[countryValue];

  const body = {
    name: country.name,
    capital: country.capital
}

  request.post(saveCountryRequestComplete, body);
}

const saveCountryRequestComplete = function(name) {
  countryView.addCountry(name);
}


const deleteButtonClicked = function(evt) {
  console.log('delete button clicked');
  request.delete(deleteRequestComplete);
}

const deleteRequestComplete = function() {
  countryView.clear();
}

var initialize = function(){
  var mapDiv = document.getElementById('main-map');

  var center = { lat: 40.712784, lng: -74.005941 };

  var mainMap = new MapWrapper(mapDiv, center, 10, function() {
    mainMap.addMarker(center);
    mainMap.addClickEvent();
  });

  // var bounceButton = document.querySelector('#button-bounce-markers')
  // bounceButton.addEventListener('click', mainMap.bounceMarkers.bind(mainMap))
}

document.addEventListener('DOMContentLoaded', app);
window.addEventListener('load', initialize);
