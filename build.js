#! /usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const fs = require('fs');

program
    .version(version)
    .option('-n, --blogname {name of your blog}', 'Name of your blog')
    .option('-i, --blogicon <url>', 'Icon of your blog')
    .option('-u, --update', 'Updates your blog website with the newest blog entries')
    .option('-b, --background <url>', 'Background image')
    .parse(process.argv);

if (program.blogname) {
    var settingsJson = JSON.parse(fs.readFileSync('settings.json').toString());  

    settingsJson[0].blogName = program.args[0];

    return fs.writeFile('settings.json', JSON.stringify(settingsJson, null, 2), err => {
        if (err) {
            console.error('Couldn\'t update settings.json!');
        } else {
            console.log('Updated settings.json!')
        }
    })
}

if (program.blogicon) {
    var settingsJson = JSON.parse(fs.readFileSync('settings.json').toString());  

    if (program.args[0].match(/\.(jpeg|jpg|png)$/) === null) return console.error('Your image link has to end with .JPEG, .JPG or .PNG!')

    settingsJson[0].blogIcon = program.args[0];

    return fs.writeFile('settings.json', JSON.stringify(settingsJson, null, 2), err => {
        if (err) {
            console.error('Couldn\'t update settings.json!');
        } else {
            console.log('Updated settings.json!')
        }
    })
}
