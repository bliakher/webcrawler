import { graphQLWebPage, webpage } from "./webpage";

export interface node {
    id : bigint,
    url : string,
    crawlTime : number,
    title : string,
    ownerId : bigint,
    links? : number[]
}

export interface graphQLNode {
    title : string,
    url : string,
    crawlTime : string,
    links? : graphQLNode[],
    owner : graphQLWebPage
}

export const nullnode : node = {
     id : BigInt(0),
     crawlTime : 0,
     url : "",
     ownerId : BigInt(0),
     title : ""
}