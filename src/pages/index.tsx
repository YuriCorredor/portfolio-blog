import Layout from '~/components/Layout'
import { makeHTMLFromMarkdown } from '~/utils/convertFromMDToHTML'
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { prisma } from '~/server/db'
import { Post } from '@prisma/client'
import { format } from 'date-fns'

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const formatTitle = (title: string) => {
    return title.slice(2)
  }

  const formatContent = (content: string) => {
    return makeHTMLFromMarkdown(content + '...')
  }

  const formatPostCreatedAt = (createdAt: Date) => {
    const date = format(new Date(createdAt), 'dd/MM/yyyy')
    return date
  }

  return (
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-screen mt-12 mb-28'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='font-bold text-text-heading text-center text-4xl md:text-5xl pt-4 pb-2 overflow-hidden text-white mb-12'>
            <span className='bg-gradient-to-bl bg-no-repeat bg-bottom bg-[length:90%_40%] from-blue-400 to-blue-600'>
              Articles
            </span>
          </h1>
          <div
            className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mx-4 max-w-7xl'
          >
            {posts?.map(post => (
              <div
                key={post.id}
                className='flex flex-col p-4 rounded border border-slate-700 hover:bg-slate-800 transition-all'
              >
                <h2
                  className='text-2xl font-bold text-slate-100 mb-4'
                >{formatTitle(post.title)}</h2>
                <div
                  className='pointer-events-none'
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />
                <div className='flex justify-between pt-4 mt-auto'>
                  <p className='text-sm text-slate-100'>
                    {formatPostCreatedAt(post.createdAt)}
                  </p>
                  <Link
                    href={`/posts/${post.id}`}
                    className='text-sm font-semibold text-sky-400 hover:underline transition-all cursor-pointer'
                  >Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

type Props = {
  posts: Post[] | null
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  let posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  posts = posts.map((post) => ({
    ...post,
    content: post.content.split(' ').slice(0, 20).join(' '),
  }))

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)) as Post[] | null,
    }
  }
}
