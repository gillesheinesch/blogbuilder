#! /usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const fs = require('fs');

program
    .version(version)
    .parse(process.argv);
