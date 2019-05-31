#! /usr/bin/env node

const program = require('commander');

program
    .option('-n, --name {name of your blog}', 'Name of your blog')
    .parse(process.argv);


console.log(1, program)
