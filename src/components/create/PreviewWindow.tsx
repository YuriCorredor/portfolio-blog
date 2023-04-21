import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { postAtom } from '~/store/postAtom'
import hljs from 'highlight.js'
import { makeHTMLFromMarkdown } from '~/utils/convertFromMDToHTML'

export default function PreviewWindow() {
  const [post] = useAtom(postAtom)
  const [previousHTML, setPreviousHTML] = useState<HTMLElement>()
  const [html, setHTML] = useState<HTMLElement>()

  useEffect(() => {
    const postTextHTML = makeHTMLFromMarkdown(post)
    const newHtml = new DOMParser().parseFromString(postTextHTML, 'text/html').body
    setPreviousHTML(html)
    setHTML(newHtml)
  }, [post])

  useEffect(() => {
    const post = document.getElementById('post')
    if (post && typeof html === 'object') {
      post.innerHTML = html.innerHTML
    }
  }, [html])

  useEffect(() => {
    const post = document.getElementById('post')
    if (typeof previousHTML === 'object' && post && typeof post === 'object') {
      let sibling = post.firstChild
      let previousSibilling = previousHTML.firstChild
      let changedElement = null
      while (sibling && previousSibilling) {
        if (sibling.isEqualNode(previousSibilling)) {
          sibling = sibling.nextSibling
          previousSibilling = previousSibilling.nextSibling
        } else {
          changedElement = sibling
          break
        }
      }
      if (changedElement) {
        const parentDiv = document.getElementById('scrollableParent')
        if (parentDiv && changedElement instanceof HTMLElement) {
          parentDiv.scrollTop = changedElement.offsetTop - 100
        }
      }
    }

    hljs.highlightAll()
  }, [previousHTML])

  return (
    <div id='scrollableParent' className='mx-auto pb-8 overflow-x-hidden'>
      <div className='mx-auto p-2 max-w-3xl'>
        {html && (
          <div id='post' className='break-words' />
        )}
      </div>
    </div>
  )
}
