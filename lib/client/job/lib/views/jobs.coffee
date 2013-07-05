
collection = require 'collection'
render = require 'render'
util = require 'util'
jobView = require './job'

mkJobsView = (opts={}) ->
  v = bQuery.view()
  JobView = jobView opts
  
  v.init (opts={}) ->
    @app = opts.app ? {}

  v.use collection
    tag: '.js-job-list'
    append:yes
    view: (m) ->
      view = new JobView
        model: m
        app: @app

      view.render()
      view

  v.use render
    template: require('../../templates').jobs
    raw:yes

  v.use util()

  v.make()

module.exports = mkJobsView
