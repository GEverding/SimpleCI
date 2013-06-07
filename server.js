
var express = require('express')
  , app = express()
  , server = require('http')
  , redis = require('redis')
  , mongose = require('mongoose')
  , routes = require('./lib/routes')
  , path = require('path')
  , kue = require('kue');

var settings = {
  git_path: "/home/geverding/dev/"
}

app.settings = settings

kue.redis.createClient = function() {
  var client = redis.createClient(6378, "127.0.0.1");
  return client;
};

var jobs = kue.createQueue();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.logger('dev'));
  app.use(express.basicAuth('foo', 'bar'));
  app.use(kue.app);
});


routes.init(app, jobs);

app.listen(5050);
console.log("Express server listening on port %d in %s mode", 5050, app.settings.env);
