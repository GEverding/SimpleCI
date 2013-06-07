var yaml = require('libyaml')
  , async = require('async')
  , spawn = require('child_process').spawn
  , path = require('path')

var Build = require('../models/build')

var buildJob = function(jobs){
  jobs.process('build', function(job, done){
    data = job.data.body
    settings = job.data.settings[0]
    console.log(settings.repo)
    cloneFrom = settings.repo+''
    cloneTo =  path.join(settings.workspace+'', settings.project+'')
    command = 'clone '+ cloneFrom +' ' + cloneTo
    console.log(command)

    //var args = { stdio: ['pipe', process.stdout, process.stderr] }

    git = spawn('git',['clone', '--progress', cloneFrom, cloneTo])
    git.stdout.setEncoding('utf8')
    git.stdout.on('data', function(data){
      console.log(data)
      job.log(''+data)
    });
    git.stderr.setEncoding('utf8')
    git.stderr.on('data', function(data){
      console.log(data)
      job.log(''+data)
    });
    git.on('exit', function(code){
      if(code !== 0){
        done(command+' failed w/ error: '+code)
      }
      else
        console.log('success')
        job.log('finsihed cloning repo')
        done()
    });
  });
}


module.exports = buildJob
