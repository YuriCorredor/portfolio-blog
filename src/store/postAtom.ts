import { atom } from 'jotai'

export const postTextAtom = atom('')

export const postTitleAtom = atom('')

export const postAtom = atom((get) => {
  const title = get(postTitleAtom)
  const text = get(postTextAtom)
  return `${title} \n ${text}`
})

