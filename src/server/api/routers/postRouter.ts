import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";

const createPostScheam = z.object({
  title: z.string(),
  content: z.string(),
});

export const postRouter = createTRPCRouter({
  createPost: adminProcedure
    .input(createPostScheam)
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      const { title, content } = input;

      return ctx.prisma.post.create({
        data: {
          title,
          content,
          authorId: user.id,
          published: true,
        },
      });
    }
  ),

  // TODO: pagination and sorting
  getAllPosts: publicProcedure
    .query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // return first 20 words of content
    return posts.map((post) => ({
      ...post,
      content: post.content.split(" ").slice(0, 20).join(" "),
    }));
  }),

  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              responseToCommentId: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
            }
          }
        },
      });
    }),
});
