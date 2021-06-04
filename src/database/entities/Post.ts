import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field(()=> Int)
  @PrimaryKey({ type: "number" })
  id!: number;

  @Field()
  @Property({type: "date", default: "NOW()"})
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date(), type: "date" })
  updatedAt: Date = new Date();

  @Field()
  @Property({type: "text"})
  title!: string;
}