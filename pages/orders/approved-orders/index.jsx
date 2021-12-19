import axios from 'axios'
import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import { getSession } from 'next-auth/client'

const index = ({ transactions }) => {
    return (
        <Layout>
            <Head>
                <title>Arumanis x Lokaloka | Admin Panel</title>
                <meta name='description' content='Admin panel for Arumanis' />
            </Head>
            <div className='flex flex-col space-y-2'>
                <Header title='Approved Orders' />
                <SubHeader title='All orders that approved and being processed' />
                <br />
                {transactions.length == 0 && <div className='w-full text-lg text-center border border-dashed border-blueGray-100 p-8 rounded h-full font-bold'>No Order</div>}
                {transactions.map((t, i) => {
                    return (
                        <div key={i} className='w-full bg-blueGray-900 shadow-sm text-xs p-2 rounded'>
                            <div className='grid grid-flow-row grid-cols-5 gap-4 px-8 py-4'>
                                <div className='flex flex-col justify-start space-y-2'>
                                    <span className='uppercase text-blueGray-400 font-medium text-sm'>Order Date</span>
                                    <span className='font-bold text-md text-blueGray-100'>{moment(t.createdAt).format('LLLL')}</span>
                                </div>
                                <div className='flex flex-col justify-start space-y-2'>
                                    <span className='uppercase text-blueGray-400 font-medium text-sm'>Total Payment</span>
                                    <span className='font-bold text-md text-blueGray-100'>
                                        <NumberFormat value={t.shouldPayAmount} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                    </span>
                                </div>
                                <div className='flex flex-col justify-start space-y-2 max-w-md'>
                                    <span className='uppercase text-blueGray-400 font-medium text-sm'>Shipping Address</span>
                                    <span className='font-bold capitalize text-md text-blueGray-100 line-clamp-2'>{t.shippingLocation}</span>
                                </div>
                                <div className='flex flex-col justify-start space-y-2 max-w-md'>
                                    <span className='uppercase text-blueGray-400 font-medium text-sm'>Customer</span>
                                    <span className='font-bold text-md text-blueGray-100 line-clamp-1'>{t.user.name}</span>
                                </div>
                                <div className='flex flex-col justify-start space-y-2'>
                                    <span className='uppercase text-blueGray-400 font-medium text-sm'>Transaction Code</span>
                                    <span className='font-bold uppercase text-md text-blueGray-100'>{t.code}</span>
                                </div>
                            </div>
                            <div className='py-6 px-8 flex flex-col space-y-2 border-t border-blueGray-500'>
                                <div className='w-full'>
                                    <span className='text-xl font-bold text-blueGray-200'>{t.products.length} Products Ordered</span>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='text-lg font-medium text-blueGray-400'>Products</span>
                                        <div className='flex flex-col flex-1 space-y-2 mt-1 text-blueGray-200'>
                                            <ul className=''>
                                                {t.products.map((p, i) => {
                                                    return (
                                                        <li key={i} className='text-xs'>
                                                            {p.product.name} x {p.quantity}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='text-lg font-medium'>&nbsp;</span>
                                        <div className='flex flex-col w-20 space-y-2 mt-1 text-blueGray-200'>
                                            <ul className=''>
                                                {t.products.map((s, i) => {
                                                    return <li key={i}>{s.quantity} Pc(s)</li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='text-lg font-medium'>&nbsp;</span>
                                        <div className='flex flex-col space-y-2 mt-1 text-blueGray-200'>
                                            <ul className=''>
                                                {t.products.map((p, i) => (
                                                    <li key={i}>
                                                        <NumberFormat value={p.product.sellingPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                                    </li>
                                                ))}{' '}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions?_sort=createdAt:asc&paymentStatus=PROCESSED`, {
        headers: {
            Authorization: `Bearer ${session.jwt}`,
        },
    })

    if (!data) return { props: { transactions: [] } }

    return {
        props: {
            transactions: data,
        },
    }
}

export default index
