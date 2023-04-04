import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { postTextAtom, postTitleAtom } from '~/store/postAtom'
import { api } from '~/utils/api'

export default function TextWindow() {
  const { mutateAsync, isLoading } = api.post.createPost.useMutation()
  const [postText, setPostText] = useAtom(postTextAtom)
  const [postTitle, setPostTitle] = useAtom(postTitleAtom)
  const displayTitle = useMemo(() => {
    return postTitle.slice(2)
  }, [postTitle])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = `# ${e.target.value}`
    setPostTitle(newTitle)
  }

  const handlePostSave = async () => {
    try {
      const saved = await mutateAsync({
        title: postTitle,
        content: postText,
      })

      if (saved) {
        setPostText('')
        setPostTitle('')
      }
    } catch {
      // continue...
    }
  }

  return (
    <div className='relative flex flex-col overflow-hidden'>
      <input
        value={displayTitle}
        onChange={handleTitleChange}
        placeholder='Write your post title here...'
        className='w-full focus:outline-none px-2 py-4 text-3xl bg-black text-slate-100 placeholder:text-gray-500'
      />
      <textarea
        placeholder='Write your post here...'
        className='flex-1 focus:outline-none p-2 resize-none bg-black text-slate-200 placeholder:text-gray-500'
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <button
        onClick={handlePostSave}
        disabled={isLoading}
        className='px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 ease-in-out duration-150 absolute right-5 bottom-2'
      >Save</button>
    </div>
  )
}
