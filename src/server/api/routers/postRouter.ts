import { z } from 'zod'

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  protectedProcedure,
} from '~/server/api/trpc'

const createPostScheama = z.object({
  title: z.string(),
  content: z.string(),
})

const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string(),
})

export const postRouter = createTRPCRouter({
  createPost: adminProcedure
    .input(createPostScheama)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { title, content } = input

      const post = await ctx.prisma.post.create({
        data: {
          title,
          content: content.trim(),
          authorId: user.id,
          published: true,
        },
      })

      return post
    }
  ),

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
    })

    return posts.map((post) => ({
      ...post,
      content: post.content.split(' ').slice(0, 20).join(' '),
    }))
  }),

  getPostComments: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.postComment.findMany({
        where: {
          postId: input.id,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        }
      })
    }),

  createPostComment: publicProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session

      const comment = await ctx.prisma.postComment.create({
        data: {
          content: input.content.trim(),
          postId: input.postId,
          authorId: session?.user ? session.user.id : null,
        },
      })

      return comment
    }
  ),

  deletePostComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session

      const comment = await ctx.prisma.postComment.findUnique({
        where: {
          id: input.id,
        },
        select: {
          authorId: true,
        },
      })

      if (!comment) {
        throw new Error('Comment not found')
      }

      if (comment.authorId !== user.id) {
        throw new Error('Not authorized')
      }

      await ctx.prisma.postComment.delete({
        where: {
          id: input.id,
        },
      })

      return true
    }
  ),

})
