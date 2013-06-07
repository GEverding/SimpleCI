
var workers = [
  'build'
]

module.exports.init = function(jobs){
  require('./lib/jobs/'+workers[0])(jobs)
}
