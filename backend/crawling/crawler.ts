'use strict';

import { node } from "../model/node";
import { execution } from "../model/execution";
import { webpage } from "../model/webpage";
import { crawlerData } from "../model/crawlerData";
import { expose } from "threads";
import { DatabaseManager } from "../dbservice/databaseManager";

const axios = require('axios')
const cheerio = require('cheerio')
const { performance } = require('perf_hooks');


export async function crawl(record: webpage, execution: execution, fromPost : boolean) : Promise<crawlerData> {
	updateExecutionStatus(execution);

	const url = record.url
	const regex = new RegExp(record.regEx)
	const nodes: node[] = [<node>{ url }]

	const crawledMap = new Map<string, number>()
	crawledMap.set(shortenUrl(url), 0)

	for (let node of nodes) {
		// console.log('crawling ' + node.url)

		if (!regex.test(node.url)) {
			// console.log('does not match regex')
			continue
		}
		
		const t1 = performance.now()

		const content = await getContent(node.url)
		node.title = getTitle(content)
		node.links = []

		const links = getLinks(content, node.url)
		for (let link of links) {

			const shortLink = shortenUrl(link)

			if (crawledMap.has(shortLink)) {
				const index = crawledMap.get(shortLink)
				if (index !== -1) {
					node.links.push(index)
				}
			}
			else {
				if (await checkContentType(link)) {
					crawledMap.set(shortLink, nodes.length)
					node.links.push(nodes.length)
					nodes.push(<node>{'url': link})
				}
				else {
					crawledMap.set(shortLink, -1)
				}
			}
		}
		const t2 = performance.now()

		node.links = Array.from(new Set(node.links))
		node.crawlTime = Math.floor(t2 - t1);
	}

	return {nodes : nodes, record : record, exec : execution, fromPost : fromPost};
}

async function checkContentType(url: string) {
	
	try {
		const { headers } = await axios.head(url)
		return headers['content-type'].startsWith('text/html')
	}
	catch (e) {
		return false
	}
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
		links.push(absoluteLink)
	});
	return links
}

function getTitle(content: string) {
	const $ = cheerio.load(content)
	return $('title').text()
}

function shortenUrl(url: string): string {
	return url
		.replace(/^https?:\/\/(www\.)?/, '')
		.split('#')[0]
		.replace(/\/$/, '')
}

function updateExecutionStatus(exec : execution) {
	exec.executionStatus = 1;
	let db = DatabaseManager.getManager();
	db.executionUpdate(exec);
}

expose(crawl);



// tohle je pro testovani z terminalu
/*
const args: string[] = process.argv.slice(2)
if (args.length !== 2) {
	console.log('wrong amount of arguments, 2 were expected')
}
else {
	const [url, regexp] = args;

	const record = <webpage>{url: url, regEx: regexp}
	const execution = <execution>{}

	crawl(record, execution)
}
*/
