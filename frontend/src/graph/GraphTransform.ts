import { ILink, INode, Node } from "../api/graphql/model";
import { RecordData } from "../model/Record";
import { D3Data, D3Link, D3Node, Owner } from "./VisualizationData";

export class GraphTransfom {

    data: Node[];
    filtered: Node[];
    records: RecordData[];

    constructor(data: Node[], records: RecordData[]) {
        this.data = data;
        this.records = records;
        this.filtered = this.filterDuplicateNodes(data);
    }

    private removeAllNodesByLinks(nodes: Map<string, Node>, links: ILink[], owners: number[]) {
        for (var link of links) {
            var node = nodes.get(link.url);
            if (node && !node.hasOtherOwners(owners)) {
                // if node is in map and doesn't have other owners than the duplicate ones we can remove it
                nodes.delete(link.url);
            }
        }
    }

    private filterDuplicateNodes(data: Node[]): Node[] {
        let uniqueNodes = new Map<string, Node>();
        for (let node of data) {
            let duplicate = uniqueNodes.get(node.url);
            if (duplicate) {
                let nodeRecord = this.findRecord(node.owners[0]);
                let duplicateRecord = this.findRecord(duplicate.owners[0]);
                if (!nodeRecord || !duplicateRecord) throw new Error("Incorrect owner id")
                if (!nodeRecord.lastExecTime || !duplicateRecord.lastExecTime || (nodeRecord.lastExecTime <= duplicateRecord.lastExecTime)) {
                    // node that is already in the map is newer so we leave its data
                    this.removeAllNodesByLinks(uniqueNodes, node.links, node.owners);
                    duplicate.owners.push(node.owners[0]); // add owner to list
                    continue;
                } else {
                    this.removeAllNodesByLinks(uniqueNodes, duplicate.links, duplicate.owners); // remove all nodes that are linked fromduplicate because we are replacing it
                    node.owners.push(...duplicate.owners);
                }
            } 
            // if map doesn't have node, or the node is older we change data

            uniqueNodes.set(node.url, node);
        }
        return Array.from(uniqueNodes.values());
    }

    private findRecord(id: number): RecordData {
        var found = this.records.filter(record => record.id === id);
        if (found.length > 0) {
            return found[0];
        }
        throw new Error("invalid owner id, cannot find record " + id);
    }

    private getDomain(url: string) {
        var parsed = /\/{1,3}([^\/]+)\/*/.exec(url);
        if (parsed) {
            return parsed[1];
        }
        throw new Error("can't parse url " + url);
        // return parsed ? parsed[1] : "";
    }

    private getOwners(ownerIds: number[]): Owner[] {
        return ownerIds.map(id => {
            var record = this.findRecord(id);
            return {id: record.id, label: record.label};
        })
    }

    private createD3Data(inputNodes: Node[], useTitle: boolean = true) : D3Data {
        let nodes: D3Node[] = [];
        let links: D3Link[] = []
        inputNodes.forEach((value) => {
            if (value.url == "https://www.vysokeskoly.cz/?utm_source=www.gymspit.cz&utm_medium=referral&utm_campaign=iframe&utm_content=logo")
                console.log(value);
            let node: D3Node = {
                id: value.url, // id is url
                name: useTitle? 
                    (value.title ? value.title : value.url) // if page has title, use title
                    : value.url, // use domain name
                crawled: value.crawlTime !== 0, // crawlTime == 0 -> not crawled
                crawlTime: value.crawlTime,
                owners: this.getOwners(value.owners)
            }
            nodes.push(node);
            value.links.forEach(link => {
                let d3link: D3Link = {source: value.url, target: link.url};
                if (link.url == "https://www.vysokeskoly.cz/katalog-vs/univerzita-karlova/1-lekarska-fakulta/153") console.log(d3link);
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