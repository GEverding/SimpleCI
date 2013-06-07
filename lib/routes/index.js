

var fs = require('fs')
var path = require('path')
var git = require('gift')
var _ = require('underscore')

var Build = require('../models/build')

var body = require('connect').bodyParser();

var repo = git('/home/geverding/dev/simplex_tests/testci_clone')

var indexCtrl = function(app) {

  app.get('/', function(req, res) {
    res.render("index", {title: "hello" });
  });

  app.post('/trigger', body, function(req, res) {
    repo.sync(function(err){
      console.log('repo.sync')
      console.log(err);
      reserror.json(200, 'success')
    });
  });

  app.get('/populateBuilds', function(req,res){
    var ret = function(msg) {
      res.json(200, msg)
    }

    done = _.after(25, ret)
    for(var i = 0; i < 25; i++){
      var status
      if( Math.floor(Math.random() * 10) % 2 === 0) {
        status = "success"
      } else {
        status = "failed"
      }

      var build = new Build({
          buildNumber: i
        , project: "test"
        , commit: '123'+i+''
        , author: 'Garrett'
        , status: status
      })
      build.save()
      done('completed')
    }

  });

  app.get('/builds', body, function(req, res) {
    Build.find(function(err, builds) {
      //console.log(builds)
      builds = _(builds).map(function(b){ return b.toObject() })
      res.json(200, builds)
    });
  })

};

module.exports.init = function(app) {
  indexCtrl(app);
};
