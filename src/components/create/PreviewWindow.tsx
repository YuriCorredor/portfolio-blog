import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { postTextAtom } from '~/store/createPostAtom'
import showdown from 'showdown'
import hljs from 'highlight.js'

const converter = new showdown.Converter()

export default function PreviewWindow() {
  const [postText] = useAtom(postTextAtom)
  const postTextHTML = converter.makeHtml(postText)

  useEffect(() => {
    hljs.highlightAll()
  }, [postText])

  console.log(postTextHTML)

  return (
    <div className="flex break-all p-2 bg-white">
      <div dangerouslySetInnerHTML={{ __html: postTextHTML }} />
    </div>
  )
}
