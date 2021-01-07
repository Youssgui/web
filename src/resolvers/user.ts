import { User } from "../entities/User"
import { MyContext } from "src/types"
import {Resolver , Mutation, InputType, Field, Ctx, Arg, ObjectType, Query} from "type-graphql"
import argon2 from 'argon2' //this is for our password hashing

//the below decorator allows us to insert the class below as input instead of listing input one by one
@InputType()
class UsernamePasswordInput{
    @Field()
    username:string
    @Field()
    password:string
}

@ObjectType()
class FieldError{ // to signal theres something wrong with a particular field (ie : username or password)
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType() //sytnax for creating graphql type
class UserResponse{ // are going to create an error object that handles errors returning
    @Field( () => [FieldError], {nullable : true})
    errors?: FieldError [];  //questionmark is for undefined , that means the userresponse object may or may not have either of these fields

    @Field( () => User , {nullable : true})
    user?: User;
}

@Resolver() 
export class UserResolver{ //here we can add functions that are either query or mutation


    @Query(() => User , {nullable : true})  //this query function queries from our database the first post with the id. with typegraphql this returns a post that could be null
    async me(@Ctx() {req,em}: MyContext){

       if(!req.session.userId){
           return null;
       }

       const user = await em.findOne(User, {id:req.session.userId});
       return user;
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg ('options') options : UsernamePasswordInput,
        @Ctx() {em} : MyContext 
    ): Promise<UserResponse>
     {
      if(options.username.length <= 2) //adding a bit of validation
      return {
          errors: [{
              field : "username",
              message : "length must be greater than 2"
          }]
      }

      if(options.password.length <= 7)
      return {
          errors: [{
              field : "password",
              message : "length must be greater than 7"
          }]
      }
      const hashedPassword = await argon2.hash(options.password) //note how we use argon
      const user = em.create(User, {
           username : options.username, //we are only passing the username for security purposes, as if the database was penetrated, the passwords would be availabel
           //instead, we wil hash the passwords
            password : hashedPassword}) //hashed password
       try{
      await em.persistAndFlush(user)
    }
    catch(err) {
        if (err.code === '23505'){
            //dup username error
            return {
                errors: [{
                    field: "username",
                    message: "username already taken"
                }
                ]
            }
        }
    }
      return {user};
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg ('options') options : UsernamePasswordInput,
        @Ctx() {em , req} : MyContext 
    ) : Promise<UserResponse>
     {
      //lookup user to see if we have the name
      const user = await em.findOne(User , {username : options.username}) //here we can append username with .toLowerCase to make the username case insenstive. 
      if (!user)
      return{
        errors : [{
            field : "username",
            message: "that username doesnt exist"
        }]
      }
      const verify = await argon2.verify(user.password, options.password) //argon2.verify here checks the saved existing user password vs the plaintext they entered in options
      if(!verify){
          return {
            errors : [{
                field : "password",
                message: "wrong password"
            }]
          }
      }

      req.session.userId  = user.id //works somehow?? you can apparenty store anything inside of session object
      return {
          user
      }
    }

} //this is our first graphql query . our schema is a single query of hello

//remeber to add all resolvers to schema