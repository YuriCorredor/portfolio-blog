import { useAtom } from 'jotai'
import Link from 'next/link'
import { currentPostIdAtom, postsAtom } from '~/store/postAtom'
import { uuid } from '~/utils/uuid'
import MinusCircle from '../icons/MinusCircle'

export default function SelectPostWindow() {
  const [currentPostId, setCurrentPostId] = useAtom(currentPostIdAtom)
  const [posts, setPosts] = useAtom(postsAtom)

  const handleCreateNewPost = () => {
    const newPostId = uuid()
    setPosts((prev) => {
      return [
        ...prev,
        {
          id: newPostId,
          title: '',
          content: '',
        },
      ]
    })

    setCurrentPostId(newPostId)
  }

  const handleDeletePost = (id: string) => {
    setPosts((prev) => {
      return prev.filter((post) => post.id !== id)
    })

    if (posts[0] && posts[0].id !== id) {
      setCurrentPostId(posts[0].id)
    } else if (posts[1]) {
      setCurrentPostId(posts[1].id)
    } else {
      setCurrentPostId('')
    }
  }

  return (
    <div className='relative flex flex-col text-white py-4 mx-2'>
      <h1
        className='w-fit text-lg font-bold bg-gradient-to-bl bg-no-repeat bg-bottom bg-[length:90%_40%] from-blue-400 to-blue-600 mb-4'
      >POSTS</h1>
      {posts.map((post) => {
        const title = post.title.slice(2) || 'Untitled'
        return (
          <div
            key={post.id}
            className='flex flex-row justify-between'
          >
            <p
              className={`${currentPostId === post.id ? 'text-white' : 'text-gray-400'} cursor-pointer text-sm hover:text-white pr-1 transition-all duration-75 break-all whitespace-nowrap overflow-hidden overflow-ellipsis`}
              onClick={() => setCurrentPostId(post.id)}
            >{title}</p>
            <MinusCircle
              onClick={() => handleDeletePost(post.id)}
            />
          </div>
        )
      })}
      <button
        onClick={handleCreateNewPost}
        className='w-fit mt-6 text-sm font-semibold text-center text-gray-300 hover:text-white rounded-md shadow-sm ease-in-out duration-150'
      >New Post</button>
      <Link
        className='px-4 py-1 mt-4 font-semibold text-xs text-center bg-blue-500 text-white rounded-md shadow-sm hover:bg-indigo-500 ease-in-out duration-150 absolute bottom-4'
        href='/'
      >
        Go to Home
      </Link>
    </div>
  )
}
