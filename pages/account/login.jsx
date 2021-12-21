import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signIn, getProviders } from 'next-auth/client'
import 'react-toastify/dist/ReactToastify.css'
import { toast, ToastContainer } from 'react-toastify'

const login = () => {
    const errorToast = (msg) => toast.error(msg)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const query = router.query?.error
        if (query) {
            setError(true)
            errorToast('Failed, Try Again')
        }
    }, [])

    const [session, loading] = useSession()

    if (session) router.push(`/orders/requested-orders`)

    const handleSubmit = (e) => {
        e.preventDefault()
        signIn('credentials', { email, password })
    }

    return (
        <div className='text-blueGray-800'>
            <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Head>
                <title>Login Dashboard Arumanis x Lokaloka</title>
            </Head>
            <div className=''>
                <section className='flex flex-col md:flex-row h-screen items-center'>
                    <div className='bg-indigo-600 hidden lg:block w-full md:w-1/2 lg:w-2/3 h-screen'>
                        <img src='https://source.unsplash.com/collection/1808212' className='object-cover w-full h-full' />
                    </div>

                    <div className='bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 lg:w-1/3 h-full px-4 md:px-6 xl:px-6 lg:px-6 flex items-center justify-center md:overflow-y-auto lg:py-6'>
                        <div className='w-full h-auto'>
                            <h1 className='text-2xl md:text-4xl lg:text-2xl 2xl:text-4xl font-bold leading-loose text-blueGray-800'>Login Dashboard Arumanis x Lokaloka</h1>

                            <form className='mt-6 text-sm md:text-base flex flex-col space-y-4' method='POST' onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor='email' className='block text-gray-700'>
                                        Email
                                    </label>
                                    <input
                                        type='email'
                                        value={email}
                                        id='email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='email@gmail.com'
                                        className='rounded-md w-full px-2 py-2 text-sm md:text-base md:px-4 md:py-3 transition ease-in-out duration-300 bg-gray-100 mt-2 border border-gray-300 focus:border-blue-600 focus:bg-white focus:outline-none'
                                        autoFocus='autofocus'
                                        autoComplete='autocomplete'
                                        required
                                    />
                                </div>

                                <div className=''>
                                    <label htmlFor='password' className='block text-gray-700'>
                                        Password
                                    </label>
                                    <input
                                        type='password'
                                        value={password}
                                        id='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='*****'
                                        minLength={6}
                                        className='rounded-md w-full px-2 py-2 text-sm md:text-base md:px-4 md:py-3 transition ease-in-out duration-300 bg-gray-100 mt-2 border border-gray-300 focus:border-blue-600 focus:bg-white focus:outline-none'
                                        required
                                    />
                                </div>

                                <div className='text-right my-2'>
                                    <Link href='/account/forgot-password'>
                                        <span className='cursor-pointer text-sm font-semibold text-blue-500 transition duration-300 ease-in-out hover:text-blue-700 focus:text-blue-700'>
                                            Lupa Password?
                                        </span>
                                    </Link>
                                </div>

                                <button
                                    type='submit'
                                    className='rounded-md w-full text-sm md:text-base block bg-blue-500 transition duration-300 ease-in-out hover:bg-blue-600 focus:bg-blue-600 text-white font-semibold px-2 py-2 md:px-4 md:py-3 '
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default login
