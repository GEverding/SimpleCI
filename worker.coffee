
cluster = require('cluster')
zmq = require('zmq')
port = 'tcp://127.0.0.1:12345'
project = require('./lib/models/projects')

if cluster.isMaster
  for i in [0..2]
    cluster.fork()

  cluster.on 'death', (worker) ->
    console.log('worker ' + worker.pid + ' died')


    #publisher = send only

  socket = zmq.socket('pub')

  socket.identity = 'publisher-' + process.pid

  stocks = ['AAPL', 'GOOG', 'YHOO', 'MSFT', 'INTC']

  socket.bind(port, (err) ->
    if (err) then throw err
    console.log('bound!')

    setInterval( ->
      symbol = stocks[Math.floor(Math.random()*stocks.length)]
      value = Math.random()*1000

      console.log(socket.identity + ': sent ' + symbol + ' ' + value)
      socket.send(symbol + ' ' + value)
    , 100)
  )

else
  #subscriber = receive only

  socket = zmq.socket('sub')

  socket.identity = 'subscriber' + process.pid

  socket.connect(port)

  socket.subscribe('AAPL')
  socket.subscribe('GOOG')
  console.log('connected!')

  socket.on('message', (data) ->
    console.log(socket.identity + ': received data ' + data.toString())
  )
