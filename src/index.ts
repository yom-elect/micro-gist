import express from 'express';
import "reflect-metadata";
import apolloServer from './apollo';
import db from './database';
import session from './redis-setup';
import cors from 'cors';

const main = async () => {
  const app = express();
  const database = await db();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

  app.use(session());

  (await apolloServer(database)).applyMiddleware({
    app,
    cors: false, // {origin:"http://localhost:3000"}
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  });
}

main()
