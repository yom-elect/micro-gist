import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from '../config/config';
import microConfig from '../mikro-orm.config';

const db = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  return orm;
}

export default db;