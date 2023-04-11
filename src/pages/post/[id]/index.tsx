import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import { prisma } from '~/server/db'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Post } from '@prisma/client'
import { makeHTMLFromMarkdown } from '~/utils/convertFromMDToHTML'
import { JSDOM } from 'jsdom'
import hljs from 'highlight.js'

export default function Home({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className='flex flex-col mx-auto'>
        <div className='flex flex-col mt-24 mb-8 p-2 max-w-3xl overflow-x-hidden break-words'>
          <div className='break-words' dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
        </div>
      </div>
    </Layout>
  )
}

type ServerProps = {
  post?: Post | null
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const id = context.params?.id
  let post = null

  if (id && typeof id === 'string') {
    post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    })

    if (post) {
      const postTextHTML = makeHTMLFromMarkdown(`${post.title}\n${post.content}`)
      const body = new JSDOM(postTextHTML).window.document.body
      const codeBlocks = body.querySelectorAll('pre')
      codeBlocks.forEach((codeBlock) => {
        hljs.highlightBlock(codeBlock)
      })

      post.content = body.innerHTML
    }
  }

  if (!post) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    }
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)) as Post | null,
    },
  }
}
