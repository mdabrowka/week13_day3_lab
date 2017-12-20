const Request = require('./services/request.js');
const CountryView = require('./views/countryView');

const request = new Request("http://localhost:3000/api/countries")
const countryView = new CountryView();

var app = function(){
const url = "https://restcountries.eu/rest/v2/all";
makeRequest(url, requestComplete);

const saveCountryButton = document.querySelector('#save-country');
saveCountryButton.addEventListener('click', saveCountryButtonClicked)
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
  const countryData = JSON.parse(jsonString);
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
    option.value = country.name;
    option.innerText = country.name;
    dropDown.appendChild(option);
  })
}

const saveCountryButtonClicked = function(evt) {
  const countryValue = document.querySelector('#all-countries-list').value;
  const body = {
    name: countryValue
  }
  request.post(saveCountryRequestComplete, body);
}

const saveCountryRequestComplete = function(name) {
  countryView.addCountry(name);
}


document.addEventListener('DOMContentLoaded', app);
