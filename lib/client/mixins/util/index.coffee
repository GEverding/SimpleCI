module.exports = (opts) ->
  return (v) ->
    v.set 'hide', (model, ns) ->
      if model?
        model.tigger 'hide', ns
        model.hidden = yes
      else
        @$el.hide()
    v.set 'show', (model, ns) ->
      if model?
        model.tigger 'show', ns
        model.hidden = no
      else
        @$el.show()
