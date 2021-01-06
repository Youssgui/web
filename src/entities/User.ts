import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

//our mikro om user entity, whwere we will store passwors and usernames

@ObjectType()
@Entity()
export class User {
        
  @Field() 
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date' ,onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text", unique : true })
  username!: string;

  
  @Property({ type: "text"})
  password!: string;

//   @ManyToOne() // when you provide correct type hint, ORM will read it for you
//   author!: Author;

//   @ManyToOne(() => Publisher) // or you can specify the entity as class reference or string name
//   publisher?: Publisher;

//   @ManyToMany() // owning side can be simple as this!
//   tags = new Collection<BookTag>(this);

//   constructor(title: string, author: Author) {
//     this.title = title;
//     this.author = author;
  }