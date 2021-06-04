import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from 'express';
import { User } from "../../database/entities/user";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>,
  req: Request & {session: Express.Session};
  res: Response;
}

declare global {
  namespace Express {
    interface Session {
      userId?: number
    }
  }
}