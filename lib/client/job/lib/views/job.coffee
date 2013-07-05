
render = require 'render'
util = require 'util'

mkJobView = (opts={}) ->
  v = bQuery.view()

  v.set 'tagName', 'tr'

  v.init (opts={}) ->
    @app = opts.app ? {}

  v.use render
    template: require('../../templates').job
    raw:yes

  v.use util()

  v.make()

module.exports = mkJobView
