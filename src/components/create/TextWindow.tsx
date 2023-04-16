import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { currentPostIdAtom, postsAtom } from '~/store/postAtom'
import { api } from '~/utils/api'

export default function TextWindow() {
  const { mutateAsync, isLoading } = api.post.createPost.useMutation()
  const [posts, setPosts] = useAtom(postsAtom)
  const [currentPostId] = useAtom(currentPostIdAtom)
  const currentPost = useMemo(() => {
    return posts.find((post) => post.id === currentPostId)
  }, [currentPostId, posts])
  const displayTitle = useMemo(() => {
    if (currentPost) {
      return currentPost.title.replace('# ', '')
    }
    return ''
  }, [currentPostId, posts])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = `# ${e.target.value}`
    setPosts((prev) => {
      return prev.map((post) => {
        if (post.id === currentPostId) {
          return {
            ...post,
            title: newTitle,
          }
        }
        return post
      })
    })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPosts((prev) => {
      return prev.map((post) => {
        if (post.id === currentPostId) {
          return {
            ...post,
            content: e.target.value,
          }
        }
        return post
      })
    })
  }

  const handlePostSave = async () => {
    try {
      const saved = await mutateAsync({
        title: currentPost?.title || '',
        content: currentPost?.content || '',
      })

      if (saved) {
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id === currentPostId) {
              return {
                ...post,
                title: '',
                content: '',
              }
            }
            return post
          })
        })
      }
    } catch {
      // continue...
    }
  }

  return (
    <div className='relative flex flex-col overflow-hidden mx-0'>
      <input
        value={displayTitle}
        onChange={handleTitleChange}
        placeholder={currentPostId ? 'Write your post title here...' : 'Select a post to edit'}
        disabled={!currentPostId}
        className='w-full focus:outline-none px-2 py-4 text-3xl bg-black text-slate-100 placeholder:text-gray-500'
      />
      <textarea
        placeholder={currentPostId ? 'Write your post here...' : ''}
        disabled={!currentPostId}
        className='flex-1 focus:outline-none p-2 resize-none bg-black text-slate-200 placeholder:text-gray-500'
        value={currentPost?.content || ''}
        onChange={handleContentChange}
      />
      <button
        onClick={handlePostSave}
        disabled={isLoading || !currentPostId}
        className='px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:scale-105 hover:bg-indigo-500 ease-in-out duration-150 absolute right-5 bottom-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-blue-500'
      >Save</button>
    </div>
  )
}
