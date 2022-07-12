
export interface IWebPage {

}

export interface INode {
    title: string | null;
    url: string;
    links: ILink[];
    owner: IOwner; 
    crawlTime: string;
}

export interface IOwner {
    identifier: string;
}

export interface ILink {
    url: string ;
}

export class Node {
    title: string | null;
    url: string;
    links: { url: string }[];
    owners: number[]; 
    crawlTime: number;
    constructor(nodeObj?: INode) {
        this.title = nodeObj ? nodeObj.title : "";
        this.url = nodeObj ? nodeObj.url : "";
        this.links = nodeObj ? nodeObj.links : [];
        this.owners = nodeObj ? [parseInt(nodeObj.owner.identifier)] : [];
        this.crawlTime = nodeObj ? parseInt(nodeObj.crawlTime) : 0;
    }

    copy(): Node {
        var copy = new Node();
        copy.title = this.title;
        copy.url = this.url;
        copy.links = [...this.links];
        copy.owners = this.owners;
        copy.crawlTime = this.crawlTime;
        return copy;
    }
}