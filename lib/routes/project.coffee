
{ _ } = require 'underscore'
api = require '../api'

Project = require '../models/project'
body = require('bodyParser')

projectCtrl = (app) ->
  
  app.get '/projects', (req, res) ->
    Project.find (err, projects) ->
      return res.json 500, {err: err} if err
      return res.jons 200, {data: projects}

module.exports = projectCtrl
