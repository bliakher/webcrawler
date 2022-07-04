import { buildSchema, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString } from "graphql";
import { DatabaseManager } from "../dbservice/databaseManager";
import { nullpage, webpage } from "../model/webpage";

// The root provides a resolver function for each API endpoint
export var qlFunctions = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};

export var qlSchema = buildSchema(`
type Query {
  quoteOfTheDay: String
  random: Float!
  rollThreeDice: [Int]
}
`);

const webpageType : GraphQLObjectType = new GraphQLObjectType({
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

const nodeType : GraphQLObjectType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(nodeType)},
    owner: { type: webpageType },
  }),
});

const queryTyp : GraphQLObjectType = new GraphQLObjectType({
  name : "Query",
  fields : {
    websites : {
      type: new GraphQLList(webpageType),
      resolve : getWebpages
      
    },
    nodes : {
      type: new GraphQLList(nodeType),
      args: { "ID" : {type : GraphQLID}},
      resolve : () => {}
    }
  }
});

async function getWebpages() {
  let db = DatabaseManager.getManager();
  let pages = await db.getWebsites();
  return pages.map((page : webpage) => {return {identifier: page.id, label : page.label, url : page.url, regexp : page.regEx, tags : page.tags, active : page.active}});
}

export var schema : GraphQLSchema = new GraphQLSchema({query : queryTyp})