
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./lib/routes')
  , http = require('http')
  , mongoose = require('mongoose')
  , path = require('path')
  , kue = require('kue')
  , redis = require('redis')
  , lessMiddleware = require('less-middleware');


var app = express();
kue.redis.createClient = function() {
  var client = redis.createClient(6378, '127.0.0.1');
  return client;
};
var jobs = kue.createQueue()

mongoose.connect('mongodb://localhost/simplex')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(lessMiddleware({
  src: __dirname + '/public',
  compress: true
}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(kue.app)

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.init(app)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
