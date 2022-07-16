import { INode, Node } from "./model";

const url = `http://${process.env.REACT_APP_BACKEND_URL_PORT}/graphql`;

export class ServiceGraphql {

    static async getNodes(recordIds: number[]): Promise<Node[] | null> {
        // return [];
        var query = `{
            nodes(webPages: [`;
        for (var id of recordIds) {
            query += '"' + id + '", ';
        };
            
        query += `]) {
              title
              url
              crawlTime
              owner {
                identifier
              }
              links {
                url
              }
            }
          }`;
        try {
            var response = await fetch(url + "?query=" + query);
            var parsed = await response.json();
            if (!parsed) return null;
            var inodes: INode[] = parsed.data.nodes;
			console.log(inodes);
            return inodes.map(nodeObj => new Node(nodeObj));
        } catch(error) {
            console.log(error);
            return null;
        }
        
    }
}