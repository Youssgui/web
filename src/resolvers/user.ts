import { User } from "../entities/User"
import { MyContext } from "src/types"
import {Resolver , Mutation, InputType, Field, Ctx, Arg} from "type-graphql"
import argon2 from 'argon2' //this is for our password hashing

//the below decorator allows us to insert the class below as input instead of listing input one by one
@InputType()
class UsernamePasswordInput{
    @Field()
    username:string
    @Field()
    password:string
}


@Resolver() 
export class UserResolver{ //here we can add functions that are either query or mutation
    @Mutation(() => User)
    async register(
        @Arg ('options') options : UsernamePasswordInput,
        @Ctx() {em} : MyContext 
    )
     {
      const hashedPassword = await argon2.hash(options.password) //note how we use argon
      const user = em.create(User, {
           username : options.username, //we are only passing the username for security purposes, as if the database was penetrated, the passwords would be availabel
           //instead, we wil hash the passwords
            password : hashedPassword}) //hashed password
      await em.persistAndFlush(user)
      return user;
    }
} //this is our first graphql query . our schema is a single query of hello

//remeber to add all resolvers to schema