import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request, Response} from 'express'
import { Session } from "express-session";


export type MyContext = {
    em : EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {session : Session }; //we did it differently here. if doesnt work, use exclamation mark on session type
    res: Response;

}




//folder we created to export our context tupe obkect so we can use it to return the correct type of object in our post resolver
