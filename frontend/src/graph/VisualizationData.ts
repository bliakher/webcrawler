
export interface D3Data {
    nodes: D3Node[];
    links: D3Link[];
}

export interface D3Node {
    id: string;
    name: string;
    crawled: boolean;
    crawlTime: number;
    owners: Owner[];
}

export interface Owner {
    id: number;
    label: string;
}

export interface D3Link {
    source: string;
    target: string;

}