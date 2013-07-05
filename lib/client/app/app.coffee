dashboard = require 'dashboard'
job = require 'job'

class App extends Backbone.Router
  routes:
    "": "dashboard"
    "dashboard": "dashboard"
    "jobs": "jobs"

  initialize: (opts={}) ->
    #@currentView = {}
    @views = {}

  activateTab: ($tab) ->
    $tab.addClass("pure-menu-selected")
    $tab.siblings().removeClass("pure-menu-selected")

  changeView: (newview) ->
    @currentView.hide() if @currentView?
    @currentView = newview
    newview.show()
    @

  page: (opts) ->
    if opts?
      config =
        app: @

      @activateTab $(opts.tag)

      if opts.collection?
        config.collection = collection = opts.collection()
        collection.fetch
          success: =>
            collection.trigger 'fetched'

      view = @views[opts.name] ?= opts.view config
      console.log view

      view.on 'navigate', (place, opt) =>
        @navigate place, opt

      @changeView(view)

  pages:
    dashboard:
      tag: '#dashboardBtn'
      name: 'dashboard'
      collection: (opts) -> new dashboard.collection null, opts
      view: (opts) ->
        DashboardView = dashboard.views.dashboard opts
        opts.el = opts.el ? '#dashboard'
        view = new DashboardView opts
        view.render()
        view
    jobs:
      tag: '#jobBtn'
      name: 'jobs'
      collection: (opts) -> new job.collection null, opts
      view: (opts) ->
        JobsView = job.views.jobs opts
        opts.el = opts.el ? '#jobs'
        view = new JobsView opts
        view.render()
        view

  dashboard: -> @go 'dashboard'
  jobs: -> @go 'jobs'

  go: (view) -> @page @pages[view]

module.exports = App
