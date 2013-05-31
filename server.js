
var express = require('express')
  , app = express()
  , server = require('http')
  , redis = require('redis')
  , mongose = require('mongoose')
  , routes = require('./lib/routes')
  , kue = require('kue');

kue.redis.createClient = function() {
  var client = redis.createClient(6378, "127.0.0.1");
  return client;
};

var jobs = kue.createQueue();

app.configure(function() {
  app.use(app.router);
  app.use(express.logger('dev'));
  app.use(express.basicAuth('foo', 'bar'));
  app.use(kue.app);
});

app.get('/', function(req, res) {
  console.log(req);
  res.redirect('active');
});

routes.init(app);

app.listen(5050);
console.log("Express server listening on port %d in %s mode", 5050, app.settings.env);
