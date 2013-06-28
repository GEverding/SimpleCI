
querystring = require('querystring')

#=----------------------------------------------------------------------------=#
# Dashbard :: Dashboard
#=----------------------------------------------------------------------------=#
class Dashboard extends Backbone.Model
  idAttribute: "_id"
  urlRoot: '/dashboard'

  initialize: (props={}) ->

module.exports = Dashboard
