
export interface D3Data {
    nodes: D3Node[];
    links: D3Link[];
}

export interface D3Node {
    id: string;
    name: string;
    crawled: boolean;
}

export interface D3Link {
    source: string;
    target: string;

}