import Split from 'react-split'
import TextWindow from '~/components/create/TextWindow'
import PreviewWindow from '~/components/create/PreviewWindow'
import Head from 'next/head'

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
