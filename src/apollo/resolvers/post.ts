import { Post } from "../../database/entities/Post";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "apollo/context";

@Resolver()
export class PostHelloResolver{
  @Query(() => [Post])
  posts(
    @Ctx() {em}: MyContext
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true})
  post(
    @Arg('id', ()=> Int) id: number,
    @Ctx() { em }: MyContext): Promise<Post| null> {
    return em.findOne(Post, {id});
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() {em}: MyContext
  ) {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Post, {nullable: true})
  async updatePost(
    @Arg("title") title: string,
    @Arg("id") id: number,
    @Ctx() {em}: MyContext
  ): Promise<Post | null> {
    const post =await  em.findOne(Post, {id});
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() {em}: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch (err) {
      return false;
    }
  }
}