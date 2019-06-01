#! /usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;
const fs = require('fs');
const jsdom = require('jsdom').JSDOM;
const options = {
	resources: 'usable'
};

program
	.version(version)
	.option('-n, --blogname {name of your blog}', 'Name of your blog')
	.option('-i, --blogicon <url>', 'Icon of your blog')
	.option('-u, --update', 'Updates your blog website with the newest blog entries')
	.parse(process.argv);

if (program.blogname) {
	const settingsJson = JSON.parse(fs.readFileSync('settings.json').toString());

	settingsJson[0].blogName = program.args[0];

	fs.writeFile('settings.json', JSON.stringify(settingsJson, null, 2), err => {
		if (err) {
			console.error('Couldn\'t update settings.json!');
		} else {
			console.log('Updated settings.json!');
		}
	});
}

if (program.blogicon) {
	const settingsJson = JSON.parse(fs.readFileSync('settings.json').toString());

	if (program.args[0].match(/\.(jpeg|jpg|png)$/) === null) return console.error('Your image link has to end with .JPEG, .JPG or .PNG!');

	settingsJson[0].blogIcon = program.args[0];

	fs.writeFile('settings.json', JSON.stringify(settingsJson, null, 2), err => {
		if (err) {
			console.error('Couldn\'t update settings.json!');
		} else {
			console.log('Updated settings.json!');
		}
	});
}

// if (!fs.existsSync(`./blog/index.html`)) {
fs.copyFile('./assets/blogTemplate.html', `./blog/index.html`, err => {
	if (err) throw err;
	jsdom.fromFile(`./blog/index.html`, options).then(dom => {
		const window = dom.window;
		const document = window.document;
		const style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', './index.css');
		document.getElementsByTagName('head')[0].appendChild(style);

		document.getElementsByTagName('title')[0].textContent = program.blogname ? program.blogname : 'Name of the Blog';
		document.getElementById('blog_title').textContent = program.blogname ? program.blogname : 'Name of the Blog';
		document.getElementById('blogIcon').setAttribute('href', program.blogicon ? program.blogicon : 'https://i.imgur.com/TFle1Cb.png');

		fs.writeFile(`./blog/index.html`, `<!DOCTYPE html>${window.document.documentElement.outerHTML}`, error => {
			if (error) throw error;
		});
		console.log('Index.html created!');
	}).catch(error => {
		console.log(error);
	});
});
// }
