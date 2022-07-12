import { ILink, INode, Node } from "../api/graphql/model";
import { RecordData } from "../model/Record";
import { D3Data, D3Link, D3Node } from "./VisualizationData";

export class GraphTransfom {

    data: Node[];
    filtered: Node[];
    records: RecordData[];

    constructor(data: Node[], records: RecordData[]) {
        this.data = data;
        this.filtered = this.filterDuplicateNodes(data);
        this.records = records;
    }

    private filterDuplicateNodes(data: Node[]): Node[] {
        let uniqueNodes = new Map<string, Node>();
        for (let node of data) {
            let duplicate = uniqueNodes.get(node.url);
            if (duplicate) {
                let nodeRecord = this.findRecord(node.ownerId);
                let duplicateRecord = this.findRecord(duplicate.ownerId);
                if (!nodeRecord || !duplicateRecord) throw new Error("Incorrect owner id")
                if (nodeRecord.lastExecTime <= duplicateRecord.lastExecTime) {
                    // node that is already in the map is newer so we leave its data
                    // we don't change the map
                    continue;
                }
            } 
            // if map doesn't have node, or the node is older we change data
            uniqueNodes.set(node.url, node);
        }
        return Array.from(uniqueNodes.values());
    }

    private findRecord(id: number): RecordData | null {
        var found = this.records.filter(record => record.id === id);
        return found.length > 0 ? found[0] : null;
    }

    private getDomain(url: string) {
        var parsed = /\/{1,3}([^\/]+)\//.exec(url);
        return parsed ? parsed[1] : "";
    }

    private createD3Data(inputNodes: Node[], useTitle: boolean = true) : D3Data {
        let nodes: D3Node[] = [];
        let links: D3Link[] = []
        inputNodes.forEach((value) => {
            let node: D3Node = {
                id: value.url, // id is url
                name: useTitle? 
                    (value.title ? value.title : value.url) // if page has title, use title
                    : value.url, // use domain name
                crawled: value.crawlTime !== 0 // crawlTime == 0 -> not crawled
            }
            nodes.push(node);
            value.links.forEach(link => {
                let d3link: D3Link = {source: value.url, target: link.url};
                links.push(d3link);
            })
            
        })
        return {nodes: nodes, links: links};
    }

    getWebsiteData(): D3Data {
        return this.createD3Data(this.filtered, true);
    }

    transformLinksToDomain(links: ILink[]): ILink[] {
        return links.map(link => ({ url: this.getDomain(link.url)}));
    }

    getDomainData() {
        var domains = new Map<string, Node>();
        for (var node of this.filtered) {
            var domainName = this.getDomain(node.url);
            var domainLinks = this.transformLinksToDomain(node.links);
            var domainNode = domains.get(domainName);
            if (domainNode) {
                domainNode.links.push(...domainLinks); // add all links
            } else {
                domainNode = node.copy();
                domainNode.url = this.getDomain(domainNode.url);
                domainNode.links = domainLinks;
                domains.set(domainName, domainNode)
            }
        }
        var domainList = Array.from(domains.values());
        return this.createD3Data(domainList, false);
    }
}