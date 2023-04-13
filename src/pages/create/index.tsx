import Split from 'react-split'
import TextWindow from '~/components/create/TextWindow'
import PreviewWindow from '~/components/create/PreviewWindow'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '~/server/auth'

export default function CreatePost() {
  return (
    <>
      <Head>
        <title>Create Post</title>
      </Head>
      <main className='flex h-screen w-screen bg-black overflow-y-auto'>
        <Split
          className='flex h-screen w-screen'
          minSize={100}
          expandToMin={false}
          direction='horizontal'
        >
          <TextWindow />
          <PreviewWindow />
        </Split>
      </main>
    </>
  )
}

// check if loged user is admin
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)
  const user = session?.user

  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}
  }
}

