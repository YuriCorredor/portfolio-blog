import { z } from 'zod'
import { env } from '~/env.mjs'

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from '~/server/api/trpc'

const createPostScheama = z.object({
  title: z.string(),
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

      let revalidationResponse = null
      try {
        const res = await fetch(`${env.NEXTAUTH_URL}/api/revalidate?secret=${env.INVALIDATION_SECRET}&post_id=${post.id}`)
        revalidationResponse = await res.json()
      } catch (err) {
        revalidationResponse = null
      }

      return {
        post,
        revalidationResponse,
      }
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
    })

    // return first 20 words of content
    return posts.map((post) => ({
      ...post,
      content: post.content.split(' ').slice(0, 20).join(' '),
    }))
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
      })
    }),
})
