const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;
const books = [
  { name: "book1", genre: "genre1", id: "1", authorId: "1" },
  { name: "book2", genre: "genre2", id: "2", authorId: "2" },
  { name: "book3", genre: "genre3", id: "3", authorId: "3" },
  { name: "book4", genre: "genre4", id: "4", authorId: "3" },
];
const authors = [
  { name: "author1", age: 27, id: "1" },
  { name: "author2", age: 28, id: "2" },
  { name: "author3", age: 66, id: "3" },
];
const bookType = new GraphQLObjectType({
  name: "Book",
  //wrap fields inside a function to get execute them after they are complitely defined
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: authorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});
const authorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(bookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //the entry point to the graph
    book: {
      type: bookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: authorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(bookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(authorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
