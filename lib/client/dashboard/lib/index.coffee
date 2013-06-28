
ex = module.exports

views = [
  "dashboard"
]

ex.views = {}
for view in views
  ex.views[view] = require("./views/#{ view }")

ex.collection = require('./collection')
ex.model = require('./model')

