
{ ObjectId } = require 'mongodb'

db = module.exports

db.oid = (s) ->
  if not s?
    return new Object()
  if typeof s is ObjectId
    return s
  return new ObjectId(s)
