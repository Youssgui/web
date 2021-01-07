import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request, Response} from 'express'


export type MyContext = {
    em : EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request;
    res: Response;

}




//folder we created to export our context tupe obkect so we can use it to return the correct type of object in our post resolver
