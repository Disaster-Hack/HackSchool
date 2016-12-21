import session from 'express-session';
import MongoStoreFactory from 'connect-mongo';

const loopback = require('loopback');
const MongoStore = MongoStoreFactory(session);
const sessionSecret = process.env.SESSION_SECRET;
const url = process.env.MONGODB || process.env.MONGOHQ_URL;

const app = loopback();
export default function sessionsMiddleware() {

    if (app.get('env') === "production") {
        const RedisStore = require('connect-redis')(session);

        let redisStoreOpts = {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            ttl: (20 * 60), // TTL of 20 minutes represented in seconds
            db: 2,
            pass: process.env.REDIS_PASSWORD
        };

        return session({
            // store: new RedisStore(redisStoreOpts),
            // 900 day session cookie
            cookie: { maxAge: 900 * 24 * 60 * 60 * 1000 },
            resave: true,
            saveUninitialized: true,
            secret: sessionSecret,
            store: new MongoStore({ url })
        });
    } else {
        return session({
            // 900 day session cookie
            cookie: { maxAge: 900 * 24 * 60 * 60 * 1000 },
            resave: true,
            saveUninitialized: true,
            secret: sessionSecret,
            store: new MongoStore({ url })
        });
    }

}
