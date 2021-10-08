import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'

const index = () => {
    return (
        <Layout>
            <Head>
                <title>Arumanis x Lokaloka | Admin Panel</title>
                <meta name='description' content='Admin panel for Arumanis' />
            </Head>
            <div className='flex flex-col space-y-2'>
                <Header title='Dashboard' />
                <SubHeader title='Summary of your sales' />
            </div>
        </Layout>
    )
}

export default index
