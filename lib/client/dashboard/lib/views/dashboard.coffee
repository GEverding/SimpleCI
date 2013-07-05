collection = require 'collection'
render     = require 'render'
util       = require 'util'

mkDashboardView = (config={}) ->
  v = bQuery.view()

  v.init (opts={}) ->
    console.log 'dashboard opts: ', opts

  v.use render
    template: require('../../templates').dashboard
    model: -> {build: 'hi'}
    raw:yes

  v.use util()

  v.make()

module.exports = mkDashboardView

  
