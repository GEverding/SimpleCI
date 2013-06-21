winston = require 'winston'

require 'winston-mongodb'

logger = new winston.Logger
  exitOnError: no
  transports: [
    new (winston.transports.Console)(
      level: 'info'
      colorize: yes
      timestamp: yes
    ),
    new (winston.transports.MongoDB)(
      level: 'info'
      db: 'simpleci'
      collection: 'Logs'
    )
  ]

logger.cli()

module.exports = logger

