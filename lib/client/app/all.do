exec >&2
redo-ifchange component.json
DEPS=$(component info . -u scripts | sed '/templates/d')
redo-ifchange $DEPS components
