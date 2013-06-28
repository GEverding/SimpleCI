var jade = require('jade-runtime');
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="header"><h3>Dashboard</h3></div><table id="builds" class="pure-table pure-table-horizontal pure-table-stripted pure-u-1"><thead class="pure-u-1"><tr class="pure-u-1"><th class="pure-u-1-12">#</th><th class="pure-u-1-6">Project</th><th class="pure-u-1-12">Commit</th><th class="pure-u-1-8">Author</th><th class="pure-u-1-6">Started At</th><th class="pure-u-1-6">Completed At</th><th class="pure-u-1-12">Status</th></tr></thead><tbody></tbody></table>');
}
return buf.join("");
};
