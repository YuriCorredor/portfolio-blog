import Head from "next/head"
import Nav from "./layout/Nav"

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
      <main className="flex flex-col min-h-screen w-screen bg-black overflow-y-auto">
        <Nav />
        {children}
      </main>
    </>
  )
}
