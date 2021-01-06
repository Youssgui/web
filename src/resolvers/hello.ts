import {Resolver , Query} from "type-graphql"

@Resolver() //the qay graphql works is you need to create a class and decorate it with this thing

export class HelloResolver{ //here we can add functions that are either query or mutation
    @Query(() => String)
    hello(){
        return "hello world"
    }
} //this is our first graphql query . our schema is a single query of hello

