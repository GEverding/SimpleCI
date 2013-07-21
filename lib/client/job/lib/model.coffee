
formatter = require 'strftime'

class Job extends Backbone.Model
  idAttribu: '_id'

  initilize: (opts={}) ->

  url: '/job'

  getStart: ->
    formatter('%B %d, %Y @ %H:%M:%S',new Date @get('createdOn'))

  getComplete: ->
    formatter('%B %d, %Y @ %H:%M:%S', new Date @get('completedOn'))

module.exports = Job
