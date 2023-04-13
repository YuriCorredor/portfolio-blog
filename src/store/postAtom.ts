import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export const postTextAtom = atomWithStorage('postTitle', '', {
  ...createJSONStorage(() => localStorage)
})

export const postTitleAtom = atomWithStorage('postContent', '', {
  ...createJSONStorage(() => localStorage)
})

export const postAtom = atom((get) => {
  const title = get(postTitleAtom)
  const text = get(postTextAtom)
  return `${title} \n ${text}`
})

