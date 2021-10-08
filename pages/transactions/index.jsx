import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'
import { getSession } from 'next-auth/client'
import axios from 'axios'

const index = ({ transactions }) => {
    return (
        <Layout>
            <Head>
                <title>Arumanis x Lokaloka | Admin Panel</title>
                <meta name='description' content='Admin panel for Arumanis' />
            </Head>
            <div className='flex flex-col space-y-2'>
                <Header title='Transactions' />
                <SubHeader title='All orders that delivered to customers' />
                <br />
                {transactions.length == 0 && <div className='w-full text-lg text-center border border-dashed border-blueGray-100 p-8 rounded h-full font-bold'>No Order</div>}
            </div>
        </Layout>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions?_sort=createdAt:desc&paymentStatus=SENT`, {
        headers: {
            Authorization: `Bearer ${session.jwt}`,
        },
    })

    return {
        props: {
            transactions: data,
        },
    }
}

export default index
