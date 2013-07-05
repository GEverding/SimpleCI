#!/usr/bin/env perl

use File::Basename;

`redo-ifchange templates/all`;

@templates = `find templates -name '*.js'`;

print "var e = module.exports;\n";
foreach (@templates) {
  chop($_);
  ($name, $path, $suffix) = fileparse($_, ('.js'));
  print "e['$name'] = require('./$_');\n";
}
