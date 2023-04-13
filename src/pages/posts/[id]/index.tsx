import { useEffect, useState } from 'react'
import Layout from '~/components/Layout'
import { prisma } from '~/server/db'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Post } from '@prisma/client'
import { makeHTMLFromMarkdown } from '~/utils/convertFromMDToHTML'
import hljs from 'highlight.js'

export default function Home({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  useEffect(() => {
    if (!post) return
    const postTextHTML = makeHTMLFromMarkdown(`${post.title}\n${post.content}`)
    const body = new DOMParser().parseFromString(postTextHTML, 'text/html').body
    const codeBlocks = body.querySelectorAll('pre')
    codeBlocks.forEach((codeBlock) => {
      hljs.configure({
        ignoreUnescapedHTML: true,
      })
      hljs.highlightBlock(codeBlock)
    })

    const postElement = document.getElementById('post')
    if (postElement) {
      postElement.innerHTML = body.innerHTML
    }
  }, [])

  return (
    <Layout>
      <div className='flex'>
        <div className='flex flex-col mt-24 mb-8 p-2 max-w-3xl mx-auto overflow-x-hidden'>
          <div id='post' className='break-words' />
        </div>
      </div>
    </Layout>
  )
}

type ServerProps = {
  post?: Post | null
}

export const getStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  })

  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<ServerProps> = async ({ params }) => {
  const id = params?.id
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
