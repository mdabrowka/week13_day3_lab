/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Request = __webpack_require__(1);
const CountryView = __webpack_require__(2);
const MapWrapper = __webpack_require__(3);

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

const Request = function(url) {
  this.url = url;
}
//making this pretty generic, si it can be re-usable
Request.prototype.get = function(callback) {
  const request = new XMLHttpRequest();
  request.open('GET', this.url);
  request.addEventListener('load', function(){
    if(this.status != 200) {
      return;
    }
    const responseBody = JSON.parse(this.responseText);
//responseBody will be allQuotes, this is dynamic - the callback can we
//whatever you want it to be, single responsibilty obeyed
    callback(responseBody);
  });
  //need to send it in here - at the very end of the function
  request.send();
}

Request.prototype.post = function(callback, body) {
  const request = new XMLHttpRequest();
  request.open('POST', this.url);
  //sometimes we need to tell the server what we're giving it in a header, where
  //the additional info lives/ insomnia did it all for us
  //now we need to add a header in js
  request.setRequestHeader('Content-Type', 'application/json');
  request.addEventListener('load', function(){
    if(this.status != 201) {
      return;
    }
    const responseBody = JSON.parse(this.responseText);
    callback(responseBody);
  });
  //we need to pass the body but stringified, so another funciton doesn't
  //need to worry about it, it's ready to go
  request.send(JSON.stringify(body));
}

Request.prototype.delete = function(callback) {
  const request = new XMLHttpRequest();
  request.open('DELETE', this.url);
  request.addEventListener('load', function() {
    if(this.status!==204) {
      return;
    }
    callback();
  });
  request.send();
}

module.exports = Request;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var CountryView = function(){
  this.countries = [];
}
//everytime you add a country it adds it to the array and displays it
CountryView.prototype.addCountry = function(country) {
  this.countries.push(country);
  this.render(country);
}

CountryView.prototype.clear = function(country) {
  this.countries = [];
  const ul = document.querySelector('#countries');
  ul.innerHTML = '';
}
//all the appending in this one
CountryView.prototype.render = function(country){
    const ul = document.querySelector('#countries');
    const liName = document.createElement('li');
    liName.innerText = country.name;
    const liCapital = document.createElement('li');
    liCapital.innerText = country.capital;
    ul.appendChild(liName);
    ul.appendChild(liCapital);
}

 module.exports = CountryView;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


var GoogleMapsLoader = __webpack_require__(4);

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {

	if (root === null) {
		throw new Error('Google-maps package can be used only in browser');
	}

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.GoogleMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var googleVersion = '3.18';

	var script = null;

	var google = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var GoogleMapsLoader = {};


	GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

	GoogleMapsLoader.KEY = null;

	GoogleMapsLoader.LIBRARIES = [];

	GoogleMapsLoader.CLIENT = null;

	GoogleMapsLoader.CHANNEL = null;

	GoogleMapsLoader.LANGUAGE = null;

	GoogleMapsLoader.REGION = null;

	GoogleMapsLoader.VERSION = googleVersion;

	GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';


	GoogleMapsLoader._googleMockApiObject = {};


	GoogleMapsLoader.load = function(fn) {
		if (google === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				GoogleMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(google);
		}
	};


	GoogleMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = GoogleMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	GoogleMapsLoader.isLoaded = function() {
		return google !== null;
	};


	GoogleMapsLoader.createUrl = function() {
		var url = GoogleMapsLoader.URL;

		url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

		if (GoogleMapsLoader.KEY) {
			url += '&key=' + GoogleMapsLoader.KEY;
		}

		if (GoogleMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
		}

		if (GoogleMapsLoader.CLIENT) {
			url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
		}

		if (GoogleMapsLoader.CHANNEL) {
			url += '&channel=' + GoogleMapsLoader.CHANNEL;
		}

		if (GoogleMapsLoader.LANGUAGE) {
			url += '&language=' + GoogleMapsLoader.LANGUAGE;
		}

		if (GoogleMapsLoader.REGION) {
			url += '&region=' + GoogleMapsLoader.REGION;
		}

		return url;
	};


	GoogleMapsLoader.release = function(fn) {
		var release = function() {
			GoogleMapsLoader.KEY = null;
			GoogleMapsLoader.LIBRARIES = [];
			GoogleMapsLoader.CLIENT = null;
			GoogleMapsLoader.CHANNEL = null;
			GoogleMapsLoader.LANGUAGE = null;
			GoogleMapsLoader.REGION = null;
			GoogleMapsLoader.VERSION = googleVersion;

			google = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.google !== 'undefined') {
				delete window.google;
			}

			if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			GoogleMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	GoogleMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	GoogleMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

		GoogleMapsLoader.createLoader = function() {
			window.google = GoogleMapsLoader._googleMockApiObject;
			window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (google === null) {
			google = window.google;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](google);
		}

		if (fn) {
			fn(google);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](google);
		}

		callbacks = [];
	};


	return GoogleMapsLoader;

});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map