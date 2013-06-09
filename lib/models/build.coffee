
mongoose = require('mongoose')
{ Schema } = mongoose
{ ObjectId } = Schema

BuildSchema = new Schema
  buildNumber: Number
  project: String
  commit: String
  author: String
  createdOn: {type: Date, default: Date.now() }
  completedOn: {type: Date, default: Date.now() }
  status:
    type: String
    enum: ['success', 'failed']

Build = mongoose.model('Build', BuildSchema)

module.exports = Build
