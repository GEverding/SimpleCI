var yaml = require('libyaml')
  , async = require('async')
  , spawn = require('child_process').spawn
  , path = require('path')

var Build = require('../models/build')

var buildJob = function(jobs){
  jobs.process('build', function(job, done){
    var steps = 3
    var data = job.data.body
    var settings = job.data.settings[0]
    console.log(settings.repo)
    var cloneFrom = settings.repo+''
    var cloneTo =  path.join(settings.workspace, settings.project)
    var command = 'clone '+ cloneFrom +' ' + cloneTo
    console.log(command)

    async.series([
      function(cb){

        var rm = spawn('rm', ['-rf', settings.workspace])

        rm.stdout.on('data', function(data){
          console.log('rm | out: ', data)
          job.log('rm | out: %s\n', data)
        });

        rm.stderr.on('data', function(data){
          console.log('rm | err : ', data)
          job.log('rm | err: %s\n', data)
        })

        rm.on('exit', function(code){
          if(code !== 0) {
            console.log('failed to delete workspace')
            cb('failed to delete workspace. rm returned: '+code)
          } else {
            console.log('cleaned workspace')
            job.progress(1, steps)
            cb(null)
          }
        });

      }, function(cb){

        var git = spawn('git', ['clone', '--progress', cloneFrom, cloneTo])

        git.stdout.setEncoding('utf8')
        git.stdout.on('data', function(data){
          //console.log('out: ', data)
          job.log('%s\n', data)
        });

        git.stderr.setEncoding('utf8')
        git.stderr.on('data', function(data){
          //console.log('err: ',data)
          job.log('%s\n', data)
        });

        git.on('exit', function(code){
          if(code !== 0){
            cb(command+' failed w/ error: '+code)
          }
          else
            console.log('git clone success')
            job.log('finsihed cloning repo')
            job.progress(2, steps)
            cb(null)
        });
      }, function(cb) {
        install = spawn('npm', ['install'], {cwd: cloneTo})

        install.stdout.setEncoding('utf8')
        install.stdout.on('data', function(data){
          //console.log('out: ', data)
          job.log('%s\n', data)
        });

        install.stderr.setEncoding('utf8')
        install.stderr.on('data', function(data){
          //console.log('err: ',data)
          job.log('%s\n', data)
        });

        install.on('exit', function(code){
          if(code !== 0){
            cb(command+' failed w/ error: '+code)
          }
          else
            console.log('npm install success')
            job.log('finished node install modules')
            job.progress(3, steps)
            cb(null)
        });

      }
    ], function(err, res){
      if(err){
        done(err);
      }
      else{
        done()
      }
    })
  })
}


module.exports = buildJob
