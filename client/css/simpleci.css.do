
LESS="simpleci.less
fonts.less
layout.less"

#CSS=""

redo-ifchange $LESS

#CSS_COMP=`mktemp`
#LESS_COMP=`mktemp`

#cat $CSS > $CSS_COMP

lessc -x simpleci.less $3
#cat $LESS_COMP $CSS_COMP > $3

#rm -f $CSS_COMP $LESS_COMP
