import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

type Post = {
  id: string
  title: string
  content: string
}

export const currentPostIdAtom = atomWithStorage('currentPostId', '', {
  ...createJSONStorage(() => localStorage)
})

export const postsAtom = atomWithStorage('posts', [] as Post[], {
  ...createJSONStorage(() => localStorage)
})

export const postAtom = atom((get) => {
  const id = get(currentPostIdAtom)
  const posts = get(postsAtom)
  const currentPost = posts.find((post) => post.id === id)

  const title = currentPost?.title || ''
  const text = currentPost?.content || ''

  return `${title}\n${text}`
})

