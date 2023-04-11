import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { forwardRef, Ref, useEffect, useRef, useState } from 'react'

const DEFAULT_PROFILE_IMAGE = 'default-profile-pic.jpg'

const Menu = forwardRef(({ showMenu }: { showMenu: boolean }, ref: Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className={`${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} absolute right-2 top-14 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-75`}
    >
      <div className='py-1'>
          <button
            onClick={() => signOut()}
            className='text-gray-700 block w-full px-4 py-2 text-left text-sm hover:text-gray-900 hover:bg-gray-200 transition-all'
            >Sign out
          </button>
      </div>
    </div>
  )
})

export default function Nav() {
  const navBar = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [prevScroll, setPrevScroll] = useState(Number.MAX_SAFE_INTEGER)
  const { data: sessionData } = useSession()
  const isSignedIn = Boolean(sessionData)
  const userName = sessionData?.user?.name
  const userImage = sessionData?.user?.image || DEFAULT_PROFILE_IMAGE

  const handleToogleMenu = () => {
    setShowMenu(prevState => !prevState)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (navBar.current) {
        const currentScroll = window.scrollY
        if (prevScroll > currentScroll) {
          navBar.current.style.top = '0'
        } else {
          navBar.current.style.top = '-74px'
          setShowMenu(false)
        }
        setPrevScroll(currentScroll)
      }
    }

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [navBar, prevScroll])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setShowMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, contentRef])

  return (
    <nav ref={navBar} className='flex fixed w-full text-white transition-all duration-300'>
      <div className='w-full justify-center flex p-4 border-b-[1px] bg-black bg-opacity-75 h-[69px] transition-all'>
        <div className='max-w-7xl flex w-full justify-between items-center flex-row whitespace-nowrap'>
          <div className='flex font-nav text-xl md:text-2xl lg:text-3xl font-extrabold'>
            <Link href='/' className='cursor-pointer hover:text-[#ddd] hover:scale-110 transition-all'>
              <span>{`<`}Yuri Corredor</span>
              <span className='pl-2'>{'/>'}</span>
            </Link>
          </div>
            {isSignedIn ? (
              <>
                <div
                  ref={contentRef}
                  onClick={handleToogleMenu} className='flex items-center cursor-pointer'
                >
                  <img
                    className='rounded-full h-10 w-10 object-cover'
                    src={userImage}
                    alt='Profile Image'
                  />
                  <span className='ml-2 hidden sm:block text-sm'>{userName}</span>
                </div>
                <Menu
                  showMenu={showMenu}
                  ref={menuRef}
                />
              </>
            ) : (
              <div className='flex items-center'>
                <button
                  className='px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-indigo-500 ease-in-out duration-150'
                  onClick={() => signIn()}
                >
                  Log in
                </button>
              </div>
            )}
          </div>
      </div>
    </nav>
  )
}
