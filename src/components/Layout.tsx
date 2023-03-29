import Head from "next/head"

type ComponentProps = {
  children: React.ReactNode
}

export default function Layout({
  children,
}: ComponentProps) {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen bg-black overflow-hidden">
        {children}
      </main>
    </>
  )
}
