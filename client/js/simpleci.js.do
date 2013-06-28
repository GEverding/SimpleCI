
BACKBONE="backbone.js"
UNDERSCORE="underscore.js"
ALLJS="bQuery.js
jquery.min.js
$UNDERSCORE
$BACKBONE
component.js"

redo-ifchange $ALLJS

cat $ALLJS | ./compress

