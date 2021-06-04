import { MikroORM, ReflectMetadataProvider } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./config/config";
import { Post } from "./database/entities/Post";
import { User } from "./database/entities/user";

export default {
  metadataProvider: ReflectMetadataProvider,
  migrations: {
    path: path.join(__dirname, './database/migrations') , // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: 'microgist',
  type: 'postgresql',
  user: "postgres",
  password: "yomibaloo1",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];