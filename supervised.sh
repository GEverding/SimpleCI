#!/bin/bash
DEPS=$(find ./lib -name "*.js" | paste -s -d, -)
DEPS+=",server.js"
supervisor -w $DEPS server.js
