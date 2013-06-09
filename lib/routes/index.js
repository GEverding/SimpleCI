
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

var Build = require('../models/build')

var body = require('connect').bodyParser();

var indexCtrl = function(app) {

  app.get('/', function(req, res) {
    res.render("index", {title: "Simplex" });
  });

  app.post('/trigger', body, function(req, res) {
    var body = req.body
    var q = Build.findOne()
    q.sort({buildNumber:-1}).limit(1)
    q.exec(function(err, build){
      console.log (build)
      var num = build !== []  ? build.buildNumber+1 : 0
      //jobs.create('build', {
        //title: 'Build #'+num,
        //settings: app.config,
        //body: body,
        //buildNum: num
      //}).save()
      res.json(200, 'recieved')
    });
  });

  app.get('/populateBuilds', function(req,res){
    var ret = function(msg) {
      res.json(200, msg)
    }

    var done = _.after(25, ret)
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
      }).save()
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
