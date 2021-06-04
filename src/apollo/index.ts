import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostHelloResolver } from "./resolvers/post";
import { MyDatabase } from "database";
import { UserResolver } from "./resolvers/users";
import { MyContext } from "../types/apollo/context";


const apolloServer = async (db: MyDatabase) => new ApolloServer({
  schema: await buildSchema({
    resolvers: [HelloResolver, PostHelloResolver, UserResolver],
    validate: false
  }),
  context: ({req, res}): MyContext => ({
    em: db.em,
    req,
    res
  })
});

export default apolloServer;