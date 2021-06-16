import { MyContext } from "apollo/context";
import { User } from "../../database/entities/user";
import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Query } from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "src/config/config";
// import { EntityManager } from '@mikro-orm/postgresql';


@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(()=> User, {nullable: true})
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
} 


@Resolver()
export class UserResolver{
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() {req, em}: MyContext
  ) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = em.findOne(User, { id: req.session.userId });
    return user;
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ) : Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [{
          field: "username",
          message: "Length must be greater than 2",
        }]
      }
    }

    if (options.password.length <= 8) {
      return {
        errors: [{
          field: "password",
          message: "Length must be greater than 8",
        }]
      }
    }
    
    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    })
    try {
      // const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
      //   username: options.username,
      //   password: hashedPassword,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // }).returning("*");
      // user = result[0]
      await em.persistAndFlush(user);
    } catch (err: unknown ) {
      // duplicate username error
      if ((err as any).code === "23505")
        return {
          errors: [{
            field: "username",
            message: "username already taken",
          }]
        };
    }

    // Store user id session , set cookie on the user
    req.session.userId = user.id;
    
    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const user =await  em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{
          field: "username",
          message: "Username doesn't exist",
        }]
      }
    }

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{
          field: "password",
          message: "invalid Password",
        }]
      }
    }

    req.session.userId = user.id

    return { user };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() {req, res} :MyContext
  ) {
    new Promise(resolve => req.session.destroy(err => {
      if (err) {
        console.log(err);
        resolve(false)
        return;
      }

      res.clearCookie(COOKIE_NAME);
      resolve(true);
    }))
  }
}