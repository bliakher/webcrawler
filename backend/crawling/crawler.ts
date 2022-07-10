'use strict';

import { node } from "../model/node";
import { execution } from "../model/execution";
import { webpage } from "../model/webpage";
import { crawlerData } from "../model/crawlerData";
import { expose } from "threads";

const axios = require('axios')
const cheerio = require('cheerio')

// TODO odstranit console.log()
export async function crawl(record: webpage, execution: execution) : Promise<crawlerData> {

	const url = cleanUrl(record.url)
	const regex = new RegExp(record.regEx)
	const nodes: node[] = [<node>{'url': new URL(url).href}]

	const crawledMap = new Map<string, number>()
	crawledMap.set(url, 0)

	for (let node of nodes) {

		if (!regex.test(node.url)) {
			console.log('regex ' + regex + ' failed for ' + node.url)
			continue
		}
		
		const content = await getContent(node.url)
		node.title = getTitle(content)
		node.links = []

		const links = getLinks(content, node.url)
		links.forEach(link => {

			if (crawledMap.has(link)) {
				node.links.push(crawledMap.get(link))
			}
			else {
				crawledMap.set(link, nodes.length)
				node.links.push(nodes.length)
				nodes.push(<node>{'url': link})
			}
		})
		node.links = Array.from(new Set(node.links))
	}
	
	return {nodes : nodes, record : record, exec : execution};
}

async function getContent(url: string) {
	
	try {
		const { data } = await axios.get(url)
		return data
	}
	catch (e) {
		return ''
	}
}

function getLinks(content: string, baseUrl: string) {

	const links: string[] = []

	const $ = cheerio.load(content)
	$('a').each((i: number, link: any) => {
		const relativeLink = link.attribs.href
		const absoluteLink = new URL(relativeLink, baseUrl).href
		links.push(cleanUrl(absoluteLink))
	});
	return links
}

function getTitle(content: string) {
	const $ = cheerio.load(content)
	return $('title').text()
}

function cleanUrl(url: string): string {
	return url.split('#')[0].replace(/\/$/, '');
}

expose(crawl);



// tohle je pro testovani z terminalu

/*const args: string[] = process.argv.slice(2)
if (args.length !== 2) {
	console.log('wrong amount of arguments, 2 were expected')
}
else {
	const [url, regexp] = args;

	const record = <webpage>{url: url, regEx: regexp}
	const execution = <execution>{}

	crawl(record, execution, () => {}, () => {})
}
*/
