import { PostComment } from '@prisma/client'
import { formatDistance } from 'date-fns'
import { useSession } from 'next-auth/react'
import { api } from '~/utils/api'

const DEFAULT_PROFILE_IMAGE = '/default-profile-pic.jpg'

type Props = {
  comment: PostComment & {
    author: {
      image: string | null;
      name: string | null;
      id: string;
    };
  }
}

export function Comment({ comment }: Props) {
  const { data: sessionData } = useSession()
  const utils = api.useContext()
  const { mutateAsync } = api.post.deletePostComment.useMutation({
    onSuccess: () => {
      utils.post.getPostComments.invalidate({ id: comment.postId })
    }
  })
  const { author } = comment
  const formattedDateFrom = formatDistance(
    new Date(comment.createdAt),
    new Date(),
  ).replace('about ', '')
  const isOwner = sessionData?.user?.id === author.id

  const handleDeleteComment = async () => {
    await mutateAsync({
      id: comment.id,
    })
  }

  return (
    <div
    key={comment.id}
    className='flex w-full mb-8'
  >
    <img
      className='w-10 h-10 rounded-full'
      src={author.image || DEFAULT_PROFILE_IMAGE}
      alt='User profile image'
    />
    <div className='w-full flex flex-col mx-4'>
      <div className='flex items-center justify-between w-full mb-1'>
        <div className='flex items-center'>
          <p className='text-sm font-semibold text-gray-200 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis'>
            {author.name}
          </p>
          <p className='ml-3 text-xs text-gray-400 whitespace-nowrap'>
            {formattedDateFrom} ago
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDeleteComment}
            className='text-sm text-gray-400 hover:text-gray-200 transition-all'
          >
            Delete
          </button>
        )}
      </div>
      <p className='text-sm text-gray-200'>
        {comment.content}
      </p>
    </div>
  </div>
  )
}
