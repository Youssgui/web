import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM} from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
    migrations:{
        path: path.join(__dirname, './migrations'), // path to the folder with migrations, use path.join with dir__name to use the right path
        pattern: /^[\w-]+\d+\.[tj]s$/ //add [tj] to accept javascript too
    },
    entities: [ Post, User ], //for our database tables
    dbName: 'web',
    user: 'postgres',
    password: 'password',
    debug: !__prod__,
    type: 'postgresql'
}as Parameters<typeof MikroORM.init>[0]; //type issue

