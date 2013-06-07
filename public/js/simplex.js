
tablesort = require('tablesort')
relative = require('relative-date')

var buildRow = function(row) {
  tmpl = "<tr class='row-head'>"
  tmpl += "<td>"+row.buildNumber+"</td>"
  tmpl += "<td>"+row.project+"</td>"
  tmpl += "<td>"+row.commit+"</td>"
  tmpl += "<td>"+row.author+"</td>"
  tmpl += "<td>"+relative(new Date(row.createdOn))+" ago</td>"
  tmpl += "<td>"+relative(new Date(row.completedOn))+" ago</td>"
  tmpl += "<td>"
  if(row.status === 'success')
    tmpl += "<span class='label label-success'>"+row.status+"</span>"
  else
    tmpl += "<span class='label label-important'>"+row.status+"</span>"
  tmpl += "</td>"
  tmpl += "</tr>"
  return tmpl
}

function getBuilds (cb) {
  console.log('getBuilds()')
  $.get('/builds',
    function(data) {
        console.log(data)
        cb(null, data)
    }
  )
}
function tableBuilt (){
  var $table = document.querySelector('#builds')
  console.log($table)
  var sorter = tablesort($table)

  var sort = function(header, index){
  }
  sorter.on('sort', function(order, header, index){
  });
}
