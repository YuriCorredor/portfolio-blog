import Split from 'react-split'
import TextWindow from '~/components/create/TextWindow'
import PreviewWindow from '~/components/create/PreviewWindow'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '~/server/auth'
import SelectPostWindow from '~/components/create/SelectPostWindow'

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
          gutterSize={5}
          expandToMin={false}
          direction='horizontal'
          maxSize={[
            200,
            2000,
            2000,
          ]}
          sizes={[10, 60, 40]}
        >
          <SelectPostWindow />
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

