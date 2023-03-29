import { useAtom } from 'jotai'
import { postTextAtom } from '~/store/createPostAtom'

export default function TextWindow() {
  const [postText, setPostText] = useAtom(postTextAtom)
  return (
    <div className="flex">
      <textarea
        className="flex-1 focus:outline-none p-2 resize-none overflow-hidden"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
    </div>
  )
}
