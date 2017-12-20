const express = require('express');
const parser = require('body-parser');
const server = express();
const MongoClient = require('mongodb').MongoClient;


server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost:27017', function(err, client){
  if(err) {
    console.log(err);
    return;
  }
  const db = client.db("bucketlist");

  console.log("connect to database");

server.post('/api/countries', function(req, res) {
  db.collection('countries').insert(req.body, function(err, result) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send();
      return;
    }
    console.log('Saved to database');
    res.status(201);
    res.json(result.ops[0]);
  });
});

server.get('/api/countries', function(req, res){
  db.collection('countries').find().toArray(function(err, result){
    if(err) {
      console.log(err);
      res.status(500);
      res.send();
      return;
    }
    res.json(result);
  })
});

server.listen(3000, function() {
  console.log("listening on port 3000");
});

});
