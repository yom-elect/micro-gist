import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";

export type MyDatabase =  MikroORM<IDatabaseDriver<Connection>>


