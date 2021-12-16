import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'
import { getSession } from 'next-auth/client'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import { useState } from 'react'

const index = ({ transactions }) => {
    const [allTransactions, setAllTransactions] = useState(transactions)
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
                {allTransactions.length == 0 && (
                    <div className='w-full text-lg text-center border border-dashed border-blueGray-100 p-8 rounded h-full font-bold'>No Transaction</div>
                )}
                {allTransactions.length != 0 && (
                    <div className='flex flex-col'>
                        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                                <div className='shadow overflow-hidden border-b border-blueGray-700 sm:rounded'>
                                    <table className='min-w-full divide-y divide-blueGray-700'>
                                        <thead className='bg-blueGray-900'>
                                            <tr>
                                                <th scope='col' className='cursor-pointer px-6 py-3 text-left text-xs font-medium text-blueGray-400 uppercase tracking-wider'>
                                                    Transaction Code
                                                </th>
                                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-blueGray-400 uppercase tracking-wider'>
                                                    Customer
                                                </th>
                                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-blueGray-400 uppercase tracking-wider'>
                                                    Total
                                                </th>
                                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-blueGray-400 uppercase tracking-wider'>
                                                    Payment Method
                                                </th>
                                                <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-blueGray-400 uppercase tracking-wider'>
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='bg-blueGray-900 divide-y divide-blueGray-700'>
                                            {allTransactions.map((t, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className='text-sm text-blueGray-200'>{t.code}</div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className='text-sm font-medium text-blueGray-200'>{t.user.name}</div>
                                                            <div className='text-sm text-blueGray-400'>{t.user.email}</div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className='text-sm text-blueGray-200'>
                                                                <NumberFormat value={t.shouldPayAmount} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} />
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap'>
                                                            <div className='text-sm text-blueGray-400'>{t.paymentMethod.replace('ID_', '')}</div>
                                                        </td>
                                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-blueGray-400'>{t.paymentStatus}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
