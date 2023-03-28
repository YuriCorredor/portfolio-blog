import { type NextPage } from "next";
import Head from "next/head";
import Split from "react-split";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen">
        <Split
          className="flex overflow-hidden h-screen w-screen"
          minSize={100}
          expandToMin={false}
          gutterSize={4}
          direction="horizontal"
        >
          <div className="bg-red-600">Left</div>
          <div className="bg-red-200">Right</div>
        </Split>
      </main>
    </>
  );
};

export default Home;
