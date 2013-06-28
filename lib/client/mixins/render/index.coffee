ap = require 'ap'

module.exports = (opts) ->
  template = opts.template
  return (v) ->
    v.set 'render', (cb) ->
      ap = ap.bind(@)

      go = (html) =>
        @$el.html(html)
        cb?(@)

      d = {}
      if opts?.model
        model = ap opts.model
      else
        model = @model

      if ap(opts.raw)?
        d.model = model
      else
        d.model = model.toJSON()

      if (ap(opts.extra))
        _(d).extend(ap(opts.extra))

      if (ap(opts.async))
        template(d, go)
      else
        go(ap(template(d)))


