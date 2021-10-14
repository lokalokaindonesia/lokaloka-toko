import { signOut, useSession } from 'next-auth/client'

const Sidebar = ({ children }) => {
    const [session, loading] = useSession()
    const logoutHandler = () => {
        if (session) {
            return signOut({
                redirect: true,
                callbackUrl: process.env.NEXTAUTH_URL,
            })
        }
    }
    return (
        <div className='sidebar'>
            <div>
                <a href='#' className='text-white flex items-center space-x-2 px-4'>
                    <svg className='w-8 h-8' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
                        />
                    </svg>
                    <span className='text-2xl font-extrabold'>Lokaloka</span>
                </a>
                <br />

                <nav className='flex flex-col space-y-1'>{children}</nav>
            </div>

            <button type='submit' className='px-4 py-2 rounded cursor-pointer bg-red-500 w-full' onClick={() => logoutHandler()}>
                Logout
            </button>
        </div>
    )
}

export default Sidebar
