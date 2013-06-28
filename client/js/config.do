#!/bin/bash
[[ $NODE_ENV = 'production' ]] && echo "release" || echo "debug"
echo "$NODE_ENV" | redo-stamp
