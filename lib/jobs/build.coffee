yaml = require('libyaml')
async = require('async')
{ spawn } = require('child_process')
path = require('path')

Build = require('../models/build')

buildJob = (jobs) ->
  jobs.process('build', (job, done) ->
    steps = 3
    data = job.data.body
    settings = job.data.settings[0]
    console.log(settings.repo)
    cloneFrom = settings.repo+''
    cloneTo =  path.join(settings.workspace, settings.project)
    command = 'clone '+ cloneFrom +' ' + cloneTo
    console.log(command)

    async.series([
      (cb) ->

        rm = spawn('rm', ['-rf', settings.workspace])

        rm.stdout.on('data', (data) ->
          console.log('rm | out: ', data)
          job.log('rm | out: %s\n', data)
        )

        rm.stderr.on('data', (data) ->
          console.log('rm | err : ', data)
          job.log('rm | err: %s\n', data)
        )

        rm.on('exit', (code) ->
          if code isnt 0
            console.log('failed to delete workspace')
            cb('failed to delete workspace. rm returned: '+code)
          else
            console.log('rm workspace success')
            job.progress(1, steps)
            cb(null)
        )

      , (cb) ->

        git = spawn('git', ['clone', '--progress', cloneFrom, cloneTo])

        git.stdout.setEncoding('utf8')
        git.stdout.on('data', (data) ->
          #console.log('out: ', data)
          job.log('%s\n', data)
        )

        git.stderr.setEncoding('utf8')
        git.stderr.on('data', (data) ->
          #console.log('err: ',data)
          job.log('%s\n', data)
        )

        git.on('exit', (code) ->
          if code isnt 0
            cb(command+' failed w/ error: '+code)
          else
            console.log('git clone success')
            job.log('finsihed cloning repo')
            job.progress(2, steps)
            cb(null)
        )
      , (cb) ->
        install = spawn('npm', ['install'], {cwd: cloneTo})

        install.stdout.setEncoding('utf8')
        install.stdout.on('data', (data) ->
          #console.log('out: ', data)
          job.log('%s\n', data)
        )

        install.stderr.setEncoding('utf8')
        install.stderr.on('data', (data) ->
          #console.log('err: ',data)
          job.log('%s\n', data)
        )

        install.on('exit', (code) ->
          if code isnt 0
            cb(command+' failed w/ error: '+code)
          else
            console.log('npm install success')
            job.log('finished node install modules')
            job.progress(3, steps)
            cb(null)
        )

    ], (err, res) ->
      done(err) if err
      done()
    )
  )


module.exports = buildJob
