
Job = require './model'

class JobCollection extends Backbone.Collection
  model: Job
  initilize: (opts={}) ->

  url: '/jobs'

module.exports = JobCollection

