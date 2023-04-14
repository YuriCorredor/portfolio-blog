import { NextApiHandler } from 'next'
import { env } from '~/env.mjs'

export const handler: NextApiHandler = async (req, res) => {
  const secret = req.query.secret as string | undefined
  const postId = req.query.post_id as string | undefined

  if (secret !== env.INVALIDATION_SECRET || !postId) {
    return res.status(401)
  }

  try {
    await res.revalidate('/')
    await res.revalidate(`/posts/${postId}`)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}

export default handler
