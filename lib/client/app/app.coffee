dashboard = require 'dashboard'

class App extends Backbone.Router
  routes:
    "": "dashboard"
    "dashboard": "dashboard"

  initialize: (opts={}) ->
    @currentView = {}
    @views = {}

  activateTab: ($tab) ->
    console.log $tab
    $tab.addClass("pure-menu-selected")
    $tab.siblings().removeClass("pure-menu-selected")

  changeView: (newview) ->
    @currentview.hide() if @currentview?
    newview.show()
    @currentview = newview

  page: (opts) ->
    console.log opts
    if opts?
      config =
        app: @

      @activateTab $(opts.tag)

      if opts.collection?
        config.collection = collection = opts.collection()
        collection.fetch
          success: =>
            collection.trigger 'fetched'

      view = @views[opts.name] = opts.view config

      view.on 'navigate', (place, opt) =>
        @navigate place, opt

      #@changeView(view)

  pages:
    dashboard:
      tag: '#dashboardBtn'
      name: 'dashboard'
      collection: (opts) -> new dashboard.collection null, opts
      view: (opts) ->
        DashboardView = dashboard.views.dashboard opts
        console.log DashboardView
        opts.el = opts.el ? '#dashboard'
        view = new DashboardView opts
        view.render()
        view

  dashboard: -> @go 'dashboard'
  #project: -> @go 'projects'

  go: (view) -> @page @pages[view]

module.exports = App
