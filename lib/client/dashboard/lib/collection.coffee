
Dashboard = require('./model')

class DashboardCollection extends Backbone.Collection
  model: Dashboard
  initialize: (opts={}) ->
  url: '/dashboard'

module.exports = DashboardCollection
