var app = function(){
const url = "https://restcountries.eu/rest/v2/all";
makeRequest(url, requestComplete);
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
    option.value = index;
    option.innerText = country.name;
    dropDown.appendChild(option);
  })
}


document.addEventListener('DOMContentLoaded', app);
