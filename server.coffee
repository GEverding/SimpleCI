
express  = require 'express'
routes   = require './lib/routes'
http     = require 'http'
mongoose = require 'mongoose'
path     = require 'path'
redis    = require 'redis'
yaml     = require 'libyaml'
less     = require 'less-middleware'
logger   = require './lib/logger'
Queue    = require './lib/queue'

queue = new Queue()
queue.createQueue()
queue.on 'connected', (data) ->
  logger.info 'Connected to Queue'
queue.on 'error', (err) ->
  logger.error "queue error: #{err}"

app = express()

yaml.readFile 'config.yaml', (err, doc) ->
  if err
    console.error 'Could not read config'
  app.config = doc

mongoose.connect 'mongodb://localhost/simplex'

#all environments
app.set('port', process.env.PORT or 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(less
  src: __dirname + '/public',
  compress: true
)
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

# development only
if 'development' is app.get('env')
  require('source-map-support').install
    handleUncaughtExceptions:no
  app.use(express.errorHandler())

routes.init(app)
#workers.init(jobs)

http.createServer(app).listen app.get('port'), ->
  console.log('Express server listening on port ', app.get('port'))
