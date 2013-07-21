
LESS="simpleci.less
lesshat.less
fonts.less
label.less
table.less
layout.less"

CSS="bootstrap.min.css
pure-min.css"

redo-ifchange $LESS

CSS_COMP=`mktemp`
LESS_COMP=`mktemp`

cat $CSS > $CSS_COMP

lessc -x simpleci.less $LESS_COMP
cat $CSS_COMP $LESS_COMP > $3

rm -f $CSS_COMP $LESS_COMP
