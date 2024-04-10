import { api } from '~/utils/api'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { Comment } from './Comment'

const DEFAULT_PROFILE_IMAGE = '/default-profile-pic.jpg'
const COMMENTS_DIV_ID = 'comments'

export function PostComments() {
  const router = useRouter()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const utils = api.useContext()
  const { data: sessionData } = useSession()
  const { id } = router.query
  const { data: comments } = api.post.getPostComments.useQuery({
    id: id as string,
  }, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
  const { isLoading, mutateAsync } = api.post.createPostComment.useMutation({
    onSuccess: () => {
      utils.post.getPostComments.invalidate({ id: id as string })
    }
  })
  const [comment, setComment] = useState('')
  const userImage = sessionData?.user?.image || DEFAULT_PROFILE_IMAGE

  const handlePostComment = async () => {
    await mutateAsync({
      postId: id as string,
      content: comment,
    })
    setComment('')
    if (textAreaRef.current) {
      textAreaRef.current?.setAttribute('style', `height: ${textAreaRef.current.scrollHeight}px; overflow-y: hidden;`)

    }
  }

  useEffect(() => {
    const handleInput = () => {
      textAreaRef.current?.setAttribute('style', 'height: 0px;')
      textAreaRef.current?.setAttribute('style', `height: ${textAreaRef.current.scrollHeight}px; overflow-y: hidden;`)
    }

    textAreaRef.current?.setAttribute('style', `height: ${textAreaRef.current.scrollHeight}px;`)

    textAreaRef.current?.addEventListener('input', handleInput)

    handleInput()
    return () => {
      textAreaRef.current?.removeEventListener('input', handleInput)
    }
  }, [textAreaRef])

  return (
    <div id={COMMENTS_DIV_ID} className='flex flex-col w-full max-w-4xl mx-auto mb-8'>
      <p
        className='pb-8 text-lg font-semibold text-gray-200 bg-black rounded-md'
      >
        {comments?.length || 0} Comments
      </p>
      <div className='flex w-full'>
        <img
          className='w-10 h-10 rounded-full'
          src={userImage}
          alt='User profile image'
        />
        <div className='w-full flex flex-col items-end mx-4'>
          <textarea
            ref={textAreaRef}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='Add a comment...'
            className='w-full px-4 py-2 text-sm text-gray-200 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
          />
          <button
            onClick={handlePostComment}
            disabled={comment.trim() === '' || isLoading}
            className='px-4 py-2 mt-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
          >
            Post
          </button>
        </div>
      </div>
      <div className='flex flex-col w-full mt-8 px-2'>
        {comments?.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
