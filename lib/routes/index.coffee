
fs = require('fs')
path = require('path')
{_} = require('underscore')

Build = require('../models/build')

body = require('connect').bodyParser()

ctrls = [
  'project'
]

indexCtrl = (app) ->

  app.get('/', (req, res) ->
    res.render("index", {title: "SimpleCI" })
  )

  app.post('/trigger', body, (req, res) ->
    body = req.body
    q = Build.findOne()
    q.sort({buildNumber:-1}).limit(1)
    q.exec((err, build) ->
      console.log (build)
      if build? then num = build.buildNumber+1 else num = 0
      #jobs.create('build', {
        #title: 'Build #'+num,
        #settings: app.config,
        #body: body,
        #buildNum: num
      #}).save()
      res.json(200, 'recieved')
    )
  )

  app.get '/populateBuilds', (req,res) ->
    ret = (msg) ->
      res.json(200, msg)

    done = _.after(25, ret)
    for i in [1..25]
      if Math.floor(Math.random() * 10) % 2 is 0
        status = "success"
      else
        status = "failed"

      build = new Build(
        buildNumber: i
        project: "test"
        commit: '123'+i+''
        author: 'Garrett'
        status: status
      ).save()
      done('completed')

  app.get '/jobs', body, (req, res) ->
    Build.find (err, builds) ->
      #console.log(builds)
      builds = _(builds).map (b) -> b.toObject()
      res.json(200, builds)


module.exports.init = (app) ->
  indexCtrl(app)

  for ctrl in ctrls
    require("../models/#{ctrl}")(app)

