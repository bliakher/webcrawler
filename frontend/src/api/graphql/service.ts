import { INode, Node } from "./model";
import { data } from "./testData";

export class ServiceGraphql {

    static async getNodes(recordIds: number[]): Promise<Node[]> {
        // return [];
        var nodes: INode[] = data.data.nodes;
        return nodes.map(nodeObj => new Node(nodeObj));
    }
}