
var body = require('connect').bodyParser();

var fs = require('fs')
var path = require('path')
var git = require('gift');

var repo = git('/home/geverding/dev/simplex_tests/testci_clone')

var indexCtrl = function(app) {
  app.get('/', function(req, res) {
    res.redirect('active');
  });

  app.post('/trigger', body, function(req, res) {
    repo.sync(function(err){
      console.log('repo.sync')
      console.log(err);
      res.json(200, 'success')
    });
  });
};

module.exports.init = function(app, jobs) {
  indexCtrl(app, jobs);
};
