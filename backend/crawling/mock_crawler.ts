import { expose } from "threads";
import { execution } from "../model/execution";
import { node } from "../model/node";
import { webpage } from "../model/webpage";

export interface return_object {
    nodes : node[],
    record : webpage,
    exec : execution
}

function sleep(ms : number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

export async function crawl(record: webpage, exec: execution) : Promise<return_object> {

    console.log(`starting crawler ${record.id}`);

    await sleep(5000);

    let nodes: node[] = [];
    nodes.push({
        ownerId: record.id,
        crawlTime: 50,
        title: "first page",
        url: record.url,
        links: [
            1, 2
        ]
    });

    nodes.push({
        ownerId: record.id,
        crawlTime: 30,
        title: "second page",
        url: "http://example.org/2",
        links: [
            2
        ]
    });

    nodes.push({
        ownerId: record.id,
        crawlTime: 5,
        title: "third page",
        url: "http://example.org/3",
        links: [
            1
        ]
    });

    return {nodes : nodes, record : record, exec : exec};
}

expose(crawl);