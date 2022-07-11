
export interface IWebPage {

}

export interface INode {
    title: string | null;
    url: string;
    links: { url: string }[];
    owner: { identifier: number }; // TODO: id string or num?
}