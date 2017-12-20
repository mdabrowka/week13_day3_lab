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
    ul.appendChild(liName);
}

 module.exports = CountryView;
