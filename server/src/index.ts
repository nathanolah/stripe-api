import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { User } from "./entity/User";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

// createConnection()
//   .then(async (connection) => {
//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";

//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("");
//     console.log("Here you can setup and run express/koa/any other framework.");
//   })
//   .catch((error) => console.log(error));

const main = async () => {
  // Express server
  const app = express();

  // graphql endpoint
  const apolloServer = new ApolloServer({
    // build schema returns a promise with the graphql schema
    // "buildSchema" is from type-graphql
    schema: await buildSchema({
      resolvers: [HelloResolver],
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  // Add graphql data to the express server
  apolloServer.applyMiddleware({
    app,
  });

  app.listen(4000, () => {
    console.log(`Server listening on localhost:${apolloServer.graphqlPath}`);
  });
};

main().catch((err) => console.log(err));
