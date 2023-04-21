import { NextApiHandler } from 'next'
import { env } from '~/env.mjs'

export const handler: NextApiHandler = async (req, res) => {
  const secret = req.query.secret as string | undefined

  if (secret !== env.INVALIDATION_SECRET) {
    return res.status(401)
  }

  try {
    await res.revalidate('/')
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}

export default handler
