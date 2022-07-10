import { execution } from "./execution";
import { node } from "./node";
import { webpage } from "./webpage";

export interface crawlerData {
    nodes : node[],
    record : webpage,
    exec : execution
}