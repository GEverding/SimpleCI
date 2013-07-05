
formatter = require 'strftime'

class Job extends Backbone.Model
  idAttribu: '_id'

  initilize: (opts={}) ->

  url: '/job'

  getStart: ->
    formatter('%H:%M:%S on %B %d, %Y',new Date @get('createdOn'))

  getComplete: ->
    formatter('%H:%M:%S on %B %d, %Y', new Date @get('completedOn'))

module.exports = Job
