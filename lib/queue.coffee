
zmq              = require 'zmq'
{ _ }            = require 'underscore'
async            = require 'async'
util             = require 'util'
{ EventEmitter } = require 'events'
log              = require './logger'
db               = require './db'

Project = require './models/project'


class Queue extends EventEmitter

  constructor: (opts={}) ->
    @host = opts.host ? 'tcp://127.0.0.1'
    @port = opts.port ? 7667
    @addr = "#{@host}:#{@port}"
    @workers = opts.workers ? 2

    EventEmitter.call(@)

    @socket = zmq.socket 'pub'
    @socket.identity = "simpleci-worker-#{ process.pid }"

  createQueue: =>
    @socket.bind @addr, (err) =>
      return @.emit 'error', err if err?
      return @.emit 'connected', {}

  # Creates New Job
  # in: job :: Object
  #     job =
  #       projectId :: ObjectId
  push: (job) =>
    log.info 'Recived Job'
    Project.findById job.projectId, (err,project) ->


module.exports = Queue




