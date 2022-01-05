import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from 'next-auth/client'

const index = () => {
    const [session, loading] = useSession()
    const router = useRouter()
    useEffect(() => {
        !session && router.push('/account/login')
        return () => {}
    }, [])
    return (
        <Layout>
            <div className='flex flex-col space-y-2'>
                <Header title='Dashboard' />
                <SubHeader title='Summary of your sales' />
            </div>
        </Layout>
    )
}

export default index
