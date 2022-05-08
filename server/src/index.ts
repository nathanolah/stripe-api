import "reflect-metadata";
import "dotenv/config"; // Allows access to my .env variables
import express from "express";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { AppDataSource } from "./data-source";
// import { createConnection } from "typeorm";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import cors from "cors";

// import { buildSchema } from "type-graphql";
// import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  // Express server
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // graphql endpoint
  const apolloServer = new ApolloServer({
    // build schema returns a promise with the graphql schema
    // "buildSchema" is from type-graphql
    // schema: await buildSchema({
    //   resolvers: [HelloResolver],
    // }),
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  //await createConnection();
  await AppDataSource.initialize();

  app.use(
    session({
      secret: "keyboardcat",
      resave: false, // resaves the session even if nothing changed (turned off waits till something changes)
      saveUninitialized: false, // await and assign a user a session utill we've added some data on the user.
    })
  );

  // Add graphql data to the express server
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log(
      `Server listening on localhost:4000${apolloServer.graphqlPath}`
    );
  });
};

main().catch((err) => console.log(err));
