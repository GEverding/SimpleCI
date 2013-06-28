collection = require 'collection'
render = require 'render'

mkDashboardView = (config={}) ->
  v = bQuery.view()

  v.init (opts={}) ->
    console.log 'dashboard opts: ', opts

  v.use render
    template: require('../../templates').dashboard
    model: -> {build: 'hi'}
    raw:yes

  v.make()

module.exports = mkDashboardView

  
