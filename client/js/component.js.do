exec >&2
DEPS=$(component info ../.. -u scripts | sed "s/^/\.\.\//")
redo-ifchange components $DEPS ../../lib/client/all

cd ../..
component build --js -o client/js -f $3
