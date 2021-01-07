// const main = async () => {

// };

// main().catch((err)=>{
// console.error(err);
// })
import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
// import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";



const main = async () =>{

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up(); //this command runs the migration when our server restarts. it does not rerun old migrations, mikro orm creates a table in postgresql that keeps track of which migrations it has or it has not run

//    const post = orm.em.create(Post , {title: "first post"}); // not actually poutting a post
//    await orm.em.persistAndFlush(post); //we add to table. /this is our first entry in the database, the em object. we plan to access
//this entry through graphql using resolvers. we sucess

    //   const posts = await orm.em.find(Post, {});
    //   console.log(posts);

      const app = express(); //setting up express app

      const RedisStore = connectRedis(session) // middleware for accessing redis, order matter here. should be between app and applying middleware. copied from the connectredis github page
      const redisClient = redis.createClient() //redis client. oreder matters because we will be using session inside apollo middleware
      
      app.use(  //redis  stuff
        session({
          name : 'bob',
          store: new RedisStore({ 
            client: redisClient,
            disableTouch: true // here, this option refers to how long we will save the cookie. disabletouch means we will save the cookie indefinitely. touch means that if the user interacts or clicks a button, it extends the cookie session life
          }),
          cookie : { //cookie stuff
            maxAge : 1000 * 60 * 60 * 24 * 365 * 10, //time in millisseconds ie 10 years
            httpOnly : true, // this is for security, in frontend js, it cannot access the cookie
            sameSite: 'lax', //crsf attack protection. cookies are a thing which keeps some information about the user on our side, used in say "display every x number of visits" 
            secure : __prod__ //means cookie only works in https 
          },
          saveUninitialized: false, //this means it will not create a session by default
          secret: 'fjaulcjmuacmoialjfhgf', //this is how its gonna assign the cookie, will make into environment variable
          resave: false,
        })
      )

      const apolloServer = new ApolloServer({ //here we create a graphql endpoint
        schema: await  buildSchema({// here we pass  our options 
          resolvers: [HelloResolver, PostResolver, UserResolver],  //graphql resolvers are repsonsible for populating the data for a single field in schema, place here all resolvers
          //so the resolver is a simple schema, and our apollo server uses that schema
          validate: false, //something annoying disabled 
        }), //we use await wwhen our function returns a promise
        context : ({req,res}): MyContext => ({ em: orm.em, req,res }), //special object that access all these resolvers. usually this is the db instance, so we need the em object from orm 
      });

      apolloServer.applyMiddleware({app}); //this commands creates a graphql endpoint for us on express
      // app.get('/', (_, res) => { //makinga get rest endpoint, '/' is homepage. this sends a message to the route
      //       res.send("ea");
      // })
      app.listen(4000, () =>{ //setting up app on localhost. express builds a rest API. setting up aroute 
        console.log('server has been setup on localhost:4000')
      })

};

main().catch((err) => {
    console.error(err);
});



// console.log("hello world");