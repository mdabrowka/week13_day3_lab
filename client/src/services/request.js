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
