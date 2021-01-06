import { Post } from "../entities/Post"
import { MyContext } from "src/types"
import {Resolver , Query, Ctx, Arg, Int, Mutation} from "type-graphql"
import { title } from "process";

@Resolver() //the qay graphql works is you need to create a class and decorate it with this thing

export class PostResolver{ //here we can add functions that are either query or mutation
    @Query(() => [Post]) //we are creating a resolver that returns a an array of post. we need to turn the class of entitiy into a class of graphql type using type-graphql
    posts(
        @Ctx() {em}: MyContext
    ): Promise<Post[]>{
        return em.find(Post, {});
    }

 
    @Query(() => Post , {nullable : true})  //this query function queries from our database the first post with the id. with typegraphql this returns a post that could be null
    post(
        @Arg("id" ) id: number, //typegraphql @arg allows the query to take in arguments
        @Ctx() {em}: MyContext
    ): Promise<Post | null >{
        return em.findOne(Post, {id}); 
    }


    @Mutation(() => Post )  //mutations is for updating or inserting new data
     async createpost(
        @Arg("title" ) title: string, //typegraphql can infer string tpe from this
        @Ctx() {em}: MyContext
    ): Promise<Post>{
        const post = em.create(Post, {title}); //we are again using em to create post 
        await em.persistAndFlush(post); //note the await next to the add. sybce we need to use await we need to make the function an async function 
        return post; 
    }
    
    @Mutation(() => Post, {nullable: true} )   //this updates a post with a given id(if there, set new title. if not, return null;)
     async updatepost(
       @Arg("id") id: number,
       @Arg("title", () =>String, {nullable: true}) title : string, //whenever we want to add nullabale, we have to explicitly set the type
       @Ctx() {em}: MyContext
   ): Promise<Post | null>{
        const post = await em.findOne (Post, {id})
        if(!post)
        {
            return null;
        }

        if(typeof title !== "undefined"){
            post.title = title;
            await em.persistAndFlush(post);
        }

       return post; 


   }

   @Mutation(() => Boolean )   //this deletes posts and returns where it returns, else retuns false
   async deletePost(
     @Arg("id") id: number,
     @Ctx() {em}: MyContext
 ): Promise<boolean>{
     try{ //dont really need this.. it always returns true since we calling delete on a nonexisted id doesnt throw an error
      await em.nativeDelete(Post, {id});
     }
     catch{
         return false;
     }
    
     return true; 


 }


} //this is our first graphql query . our schema is a single query of hello

