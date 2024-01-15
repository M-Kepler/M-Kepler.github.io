#!/usr/bin/env bash
cp deploy/tools/gen_sidebar.js ./
node gen_sidebar.js
docsify serve .

