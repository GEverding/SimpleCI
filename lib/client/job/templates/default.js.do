redo-ifchange $2.jade
echo "var jade = require('jade-runtime');";
echo -n "module.exports = "
jade -Dc < $2.jade
echo ";"
