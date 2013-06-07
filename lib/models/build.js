
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId

var BuildSchema = new Schema({
    buildNumber: Number
  , project: String
  , commit: String
  , author: String
  , createdOn: {type: Date, default: Date.now() }
  , completedOn: {type: Date, default: Date.now() }
  , status: {
      type: String
    , enum: ['success', 'failed']
  }
})

var Build = mongoose.model('Build', BuildSchema);

module.exports = Build
