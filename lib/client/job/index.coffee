
ex = module.exports

views = [
  "job"
  "jobs"
]

ex.views = {}

for view in views
  ex.views[view] = require "./lib/views/#{view}"

ex.model = require('./lib/model')
ex.collection = require('./lib/collection')

