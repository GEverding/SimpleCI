TARG=$2
if [ -e "$2.coffee" ]; then
  redo-ifchange $2.coffee
  coffee -mc $2.coffee
  mv $2.js $3
fi
