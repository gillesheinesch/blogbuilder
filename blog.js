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
	.option('-t, --title <title>', 'Title for the blog entry')
	.option('-s, --subtitle <subtitle>', 'Subtitle for the blog entry')
	.option('-p, --pagetitle <pagetitle>', 'Title of the website page')
	.option('-f, --folder <folder>', 'Foldername for the blog entry')
	.option('-k, --keywords <keywords>', 'Keywords for the blog entry')
	.option('-a, --tags <tags>', 'Tags for the blog entry')
	.option('-i, --image <url>', 'Header image of the blog entry entry')

	.parse(process.argv);

if (program.title) {
	if (!fs.existsSync(`./blog/${program.title}`)) {
		fs.mkdirSync(`./blog/${program.title}`);
		console.log(`${program.title} folder created!`);
	}

	fs.copyFile('./assets/blogEntryTemplate.html', `./blog/${program.title}/index.html`, err => {
		if (err) throw err;
		jsdom.fromFile(`./blog/${program.title}/index.html`, options).then(dom => {
			const window = dom.window;
			const document = window.document;
			const style = document.createElement('link');
			style.setAttribute('rel', 'stylesheet');
			style.setAttribute('href', './../index.css');
			document.getElementsByTagName('head')[0].appendChild(style);

			document.getElementsByTagName('title')[0].textContent = program.pagetitle ? program.pagetitle : 'Test Entry';
			document.getElementById('blog_title').textContent = program.title;
			document.getElementById('blog_sub_title').textContent = program.subtitle ? program.subtitle : 'Test Entry Subtitle';

			fs.writeFile(`./blog/${program.title}/index.html`, `<!DOCTYPE html>${window.document.documentElement.outerHTML}`, error => {
				if (error) throw error;
				const blogEntrySettings = {
					createdAt: Date.now(),
					websiteTitle: program.pagetitle ? program.pagetitle : 'Test Entry',
					title: program.title,
					subTitle: program.subtitle ? program.subtitle : 'Test Entry Subtitle',
					headerImage: program.image ? program.image : 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
					visible: true,
					keywords: [],
					tags: []
				};
				fs.readFile('./blog/blog.json', (error2, data) => {
					if (error2) throw error2;
					const oldBlogs = JSON.parse(data);
					oldBlogs.push(blogEntrySettings);
					fs.writeFile('./blog/blog.json', JSON.stringify(oldBlogs, null, ' '), error3 => {
						if (error3) throw error3;
						console.log('Created successfully a new blog entry in the blog folder!');
					});
				});
			});
		}).catch(error => {
			console.log(error);
		});
	});
} else {
	console.error('You have to provide a title!');
}
