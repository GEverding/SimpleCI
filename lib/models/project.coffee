
mongoose = require 'mongoose'
{ Schema } = mongoose
{ ObjectId } = Schema

buildSteps = [
  'prebuild'
  'build'
  'postbuild'
]

BuildStepSchema = new Schema
  name: String
  command: String
  args: [String]
  kind:
    type: String
    enum: buildSteps
  previous: ObjectId
  next: ObjectId

ProjectSchema = new Schema
  name:
    type: String
    requred: yes
  private:
    type: Boolean
    default: no
  url:
    type: String
    required: yes
  workspace:
    type: String
    required: yes
  steps: [BuildStepSchema]

Project = mongoose.model 'Project', ProjectSchema

module.exports = Project
