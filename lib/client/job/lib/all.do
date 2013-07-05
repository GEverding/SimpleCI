exec >&2
cd ..
redo-ifchange component.json
DEPS=$(component info . -u scripts | sed '/templates/d')
redo-ifchange $DEPS
