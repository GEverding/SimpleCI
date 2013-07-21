
render = require 'render'
util = require 'util'

mkJobView = (opts={}) ->
  v = bQuery.view()

  v.set 'tagName', 'tr'

  v.init (opts={}) ->
    @app = opts.app ? {}
    @on 'render', =>
      console.log 'rendered fired'
      @setLabel()

  v.use render
    template: require('../../templates').job
    raw:yes

  v.set 'setLabel', ->
    $label = @$('.label')
    switch @model.get('status')
      when 'success'
        $label.addClass('label-success')
        $label.removeClass('label-important')
      when 'failed'
        $label.removeClass('label-success')
        $label.addClass('label-important')
      else
        throw new Error("Unknown job status")

  v.use util()

  v.make()

module.exports = mkJobView
