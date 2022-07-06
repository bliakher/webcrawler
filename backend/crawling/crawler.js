'use strict';

const axios = require('axios')
const cheerio = require('cheerio')


async function crawl(url, regex) {

	let urls = [cleanUrl(url)]

	while (urls.length !== 0) {

		console.log(urls)

		let url = urls.pop()
		let content = await getPageContent(url)
		let links = findLinks(content)

		links.forEach((link, i) => {
			if (!link.includes('://')) {
				links[i] = url + link
			}
		})

		console.log(links)

		break
	}
	
}

// odebere query a fragment cast z url
function cleanUrl(url) {
	return url.split(/[?#]/)[0];
}

// vrati obsahy vsech <a href=...>
function getLinks(content) {

	const $ = cheerio.load(content)
	let links = []
	$('a').each((i, link) => {
		links.push(cleanUrl(link.attribs.href))
	});
	return links
}

// vrati obsah stranky na dane url
async function getPageContent(url) {

	try {
		let response = await axios.get(url)
		return response.data
	}
	catch (e) {
		return ''
	}
}

// spousteni z konzole
const args = process.argv.slice(2)
if (args.length !== 2) {
	console.log('wrong amount of arguments, 2 expected')
	return
}
crawl(...args)

