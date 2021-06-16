import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, redisSecret, __prod__ } from './config/config';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const userSession = () => session({
  name: COOKIE_NAME,
  store: new RedisStore({ client: redisClient, disableTouch: true }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax', //csrf
    secure: __prod__
  },
  secret: redisSecret!,
  saveUninitialized: false,
  resave: false,
});


export default userSession;