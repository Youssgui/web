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


const main = async () =>{

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

//    const post = orm.em.create(Post , {title: "first post"}); // not actually poutting a post
//    await orm.em.persistAndFlush(post); //we add to table. /this is our first entry in the database, the em object. we plan to access
//this entry through graphql using resolvers. we sucess

    //   const posts = await orm.em.find(Post, {});
    //   console.log(posts);

      const app = express(); //setting up express app
      const apolloServer = new ApolloServer({ //here we create a graphql endpoint
        schema: await  buildSchema({// here we pass  our options 
          resolvers: [HelloResolver, PostResolver],  //resolvers are repsonsible for populating the data for a single field in schema, place here all resolvers
          //so the resolver is a simple schema, and our apollo server uses that schema
          validate: false, //something annoying disabled 
        }), //we use await wwhen our function returns a promise
        context : () => ({ em: orm.em }) //special object that access all these resolvers. we need the em object from orm 
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