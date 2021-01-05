// const main = async () => {

// };

// main().catch((err)=>{
// console.error(err);
// })

import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";



const main = async () =>{
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
//    const post = orm.em.create(Post , {title: "first post"}); // not actually poutting a post
//    await orm.em.persistAndFlush(post); //we add to table. 
//    await orm.em.nativeInsert(Post, {title: 'first post'})
      const posts = await orm.em.find(Post, {});
      console.log(posts);
};

main().catch((err) => {
    console.error(err);
});



// console.log("hello world");