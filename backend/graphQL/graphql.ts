import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { DatabaseManager } from "../dbservice/databaseManager";
import { graphQLNode, node } from "../model/node";
import { graphQLWebPage, webpage } from "../model/webpage";

const webpageType: GraphQLObjectType = new GraphQLObjectType({
  name: "Webpage",
  fields: {
    identifier: { type: GraphQLID },
    label: { type: GraphQLString },
    url: { type: GraphQLString },
    regexp: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    active: { type: GraphQLBoolean },

  }
});

const nodeType: GraphQLObjectType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(nodeType) },
    owner: { type: webpageType },
  }),
});

const queryType: GraphQLObjectType = new GraphQLObjectType({
  name: "Query",
  fields: {
    websites: {
      type: new GraphQLList(webpageType),
      resolve: getWebpages
    },
    nodes: {
      type: new GraphQLList(nodeType),
      args: { "ID": { type: GraphQLID } },
      resolve: async (obj, args) => {
        return getGraph(args.ID);
      },
    }
  }
});

function webpageToGraphQL(pages: webpage[]): graphQLWebPage[] {
  return pages.map((page: webpage) => { return { identifier: page.id, label: page.label, url: page.url, regexp: page.regEx, tags: page.tags, active: page.active } });
}

function nodeToGrapQL(node: node, neighbours: node[], owners: any): graphQLNode {
  if (neighbours) {
    return {
      url: node.url,
      crawlTime: node.crawlTime.toString(),
      owner: owners[node.ownerId.toString()],
      title: node.title,
      links: neighbours.map((neighbour: node) => { return nodeToGrapQL(neighbour, null, owners) })
    };
  } else {
    return {
      url: node.url,
      crawlTime: node.crawlTime.toString(),
      owner: owners[node.ownerId.toString()],
      title: node.title,
      links: null
    };
  }

}

async function getWebpages() {
  let db = DatabaseManager.getManager();
  let pages = await db.getWebsites();
  return webpageToGraphQL(pages);
}

async function getGraph(id: bigint) {
  let db = DatabaseManager.getManager();
  let nodes = await db.getCrawledSitesForGraph(id);
  let pages = webpageToGraphQL(await db.getWebsites());
  let mapOfNodes = Object.fromEntries(nodes.map((node, index) => [node.id.toString(), node]));
  let mapOfPages = Object.fromEntries(pages.map((page, index) => [page.identifier.toString(), page]));
  let result: graphQLNode[] = [];
  for (let node of nodes) {
    let neighbours: node[] = [];
    if (node.links) {
      for (let id of node.links) {
        neighbours.push(mapOfNodes[id.toString()]);
      }
    }
    result.push(nodeToGrapQL(node, neighbours, mapOfPages));
  }
  return result;
}

export var schema: GraphQLSchema = new GraphQLSchema({ query: queryType });