import Split from "react-split"
import Layout from "~/components/Layout"
import TextWindow from "~/components/create/TextWindow"
import PreviewWindow from "~/components/create/PreviewWindow"

export default function CreatePost() {
  return (
    <Layout>
      <Split
        className="flex overflow-hidden h-screen w-screen"
        minSize={100}
        expandToMin={false}
        gutterSize={4}
        direction="horizontal"
      >
        <TextWindow />
        <PreviewWindow />
      </Split>
    </Layout>
  )
}
