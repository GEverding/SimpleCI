find -name '*.jade' | sed 's/jade/js/g' | xargs redo-ifchange
