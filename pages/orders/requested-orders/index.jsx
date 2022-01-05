import axios from 'axios'
import Head from 'next/head'
import Header from '@/components/atoms/content/Header'
import SubHeader from '@/components/atoms/content/SubHeader'
import Layout from '@/components/layout/Layout'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { getSession, useSession } from 'next-auth/client'
import Recta from 'recta'
import Notifier from 'react-desktop-notification'

const index = ({ transactions }) => {
    const [session, loading] = useSession()
    const [requestedOrders, setRequestedOrders] = useState(transactions)
    const [selectedID, setSelectedID] = useState(null)
    const [open, setOpen] = useState(false)

    const cancelButtonRef = useRef(null)

    useEffect(() => {
        setInterval(() => {
            getUpdatedTransactions()
        }, 5000)

        return () => {
            setRequestedOrders(transactions)
        }
    }, [])

    const getUpdatedTransactions = async () => {
        // let showNotif = false
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions?_sort=createdAt:desc&paymentStatus_in=SUCCESS&paymentStatus_in=PAID&paymentStatus_in=INACTIVE&paymentStatus_in=COMPLETED&paymentStatus_in=SUCCEEDED&paymentStatus_in=SETTLEMENT`
        )

        setRequestedOrders((prevState) => {
            //     if (prevState.length !== data.length) {
            //         showNotif = true
            //     }
            return data
        })

        // if (showNotif) {
        //     Notifier.start('Lokaloka x Arumanis', 'Pesanan Baru', 'https://lokaloka.id/orders/requested-orders')
        //     showNotif = false
        // }

        return
    }

    const updateDataOnly = async () => {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions?_sort=createdAt:desc&paymentStatus_in=SUCCESS&paymentStatus_in=PAID&paymentStatus_in=INACTIVE&paymentStatus_in=COMPLETED&paymentStatus_in=SUCCEEDED&paymentStatus_in=SETTLEMENT`
        )

        setRequestedOrders(data)
        return
    }

    // !DEV const printer = new Recta('3178503389', '1811')
    const printer = new Recta('1678769438', '1811')
    const acceptOrder = async () => {
        const rawTrans = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${selectedID}`)
        const data = rawTrans.data
        const forPrintProds = data.products.map((x) => {
            return `${x.product.name.substr(0, 15)} ${x.quantity} ${x.product.sellingPrice} ${x.quantity * x.product.sellingPrice}`
        })

        const z = data.products.map((x) => {
            return x.quantity + 'x  ' + x.product.name
        })

        const products = z.toString().replaceAll(',', '\n')

        const message = `
        <b>PESANAN BARU</b>
=================
<b>Tanggal = ${moment(data.createdAt).locale('id').format('L')} - ${moment(data.createdAt).locale('id').format('LT')}</b>
<b>Kode Transaksi = ${data.code}</b>
<b>Total = ${data.shouldPayAmount}</b>
<b>Pembayaran = ${data.paymentMethod == 'COD' ? 'COD' : 'Lunas'}</b>
<b>Nama = ${data.user.name}</b>
<b>Nomor = ${data.phone}</b>
<b>Alamat = ${data.shippingLocation}</b>
<b>Catatan = ${data.notes ? data.notes : ''}</b>
                `
        await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions/${selectedID}`,
            {
                paymentStatus: 'PROCESSED',
            },
            {
                headers: {
                    Authorization: `Bearer ${session.jwt}`,
                },
            }
        )

        updateDataOnly()

        printer.open().then(function () {
            printer
                .align('center')
                .bold(false)
                .text('*** LOKALOKA INDONESIA ***')
                .feed(1)
                .align('left')
                .bold(false)
                .text('Jl. PANGERAN DIPONEGORO, 5\n02/02, TULUNGREJO, BUMIAJI, BATU\n65336')
                .bold(false)
                .text('================================')
                .align('left')
                .text(`CUSTOMER : ${data.user.name}`)
                .align('left')
                .bold(false)
                .text(moment(data.createdAt).locale('id').format('L') + ' - ' + moment(data.createdAt).locale('id').format('LT'))
                .text(data.code)
                .bold(false)
                .text('================================')
                .bold(false)
                .text(forPrintProds.toString().toUpperCase().replace(',', '\n'))
                .align('right')
                .text('===============')
                .align('right')
                .text(`SUBTOTAL : ${data.totalPrice}`)
                .align('right')
                .text('===============')
                .align('right')
                .text(`BIAYA PENGIRIMAN : ${data.shippingCost}`)
                .align('right')
                .text(`BIAYA PENANGANAN : 2000`)
                .align('right')
                .text(`PACKAGING : ${data.packagingFee}`)
                .align('right')
                .text(`DISKON : -${data.coupon ? data.totalPrice - (data.totalPrice * data.coupon.discount) / 100 : '0'}`)
                .align('right')
                .text('===============')
                .align('right')
                .text(`TOTAL : ${data.shouldPayAmount}`)
                .feed(1)
                .align('center')
                .text(`--- TERIMA KASIH ---`)
                .feed(3)
                .print()
        })

        if (data.area == 'malang-batu') {
            axios.post(`/api/telegram/sendMessage`, {
                message,
            })
        }
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>Arumanis x Lokaloka | Admin Panel</title>
                    <meta name='description' content='Admin panel for Arumanis' />
                </Head>
                <div className='flex flex-col space-y-2 print:hidden'>
                    <Header title='Requested Orders' />
                    <SubHeader title='All orders that required approval from store' />
                    <br />
                    {!requestedOrders && <div className='w-full text-lg text-center border border-dashed border-blueGray-100 p-8 rounded h-full font-bold'>No Order</div>}
                    {requestedOrders.map((t, i) => {
                        return (
                            <div key={i} className='w-full bg-blueGray-900 shadow-sm text-xs p-2 rounded'>
                                <div className='grid grid-flow-row grid-cols-6 gap-4 px-8 py-4'>
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
                                        <span className='uppercase text-blueGray-400 font-medium text-sm'>Packaging</span>
                                        <span className='font-bold capitalize text-md text-blueGray-100 line-clamp-2'>{t.packagingFee != 0 ? 'KARDUS' : 'PLASTIK'}</span>
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
                                                                {p.product.name}
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
                                        <div className='flex flex-col space-y-2'>
                                            <span className='text-lg font-medium'>&nbsp;</span>
                                            <div
                                                onClick={() => {
                                                    setSelectedID(t.id)
                                                    setOpen(true)
                                                }}
                                                className='bg-blue-500 hover:bg-blue-600 transition ease-in duration-150 text-blueGray-100 font-bold cursor-pointer px-4 py-2 rounded'
                                            >
                                                Accept
                                            </div>
                                            {/* <div className='bg-blueGray-900 border border-blueGray-100 hover:border-red-500 hover:bg-red-500 transition ease-in duration-150 font-bold cursor-pointer text-blueGray-100 px-4 py-2 rounded'>
                                                Decline
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Transition.Root show={open} as={Fragment}>
                    <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' initialFocus={cancelButtonRef} onClose={setOpen}>
                        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0'
                                enterTo='opacity-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100'
                                leaveTo='opacity-0'
                            >
                                <Dialog.Overlay className='fixed inset-0 bg-blueGray-500 bg-opacity-75 transition-opacity' />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                                enterTo='opacity-100 translate-y-0 sm:scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                            >
                                <div className='inline-block align-bottom bg-blueGray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                                    <div className='bg-blueGray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                                        <div className='sm:flex sm:items-start'>
                                            <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blueGray-100 sm:mx-0 sm:h-10 sm:w-10'>
                                                <ExclamationIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />
                                            </div>
                                            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                                <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-blueGray-100'>
                                                    Accept Order
                                                </Dialog.Title>
                                                <div className='mt-2'>
                                                    <p className='text-sm text-blueGray-200'>Are you sure you want to accept this order?</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bg-blueGray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                                        <button
                                            type='button'
                                            className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                                            onClick={() => {
                                                acceptOrder()
                                                setOpen(false)
                                            }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            type='button'
                                            className='mt-3 w-full inline-flex justify-center rounded-md border border-blueGray-800 shadow-sm px-4 py-2 bg-blueGray-800 text-base font-medium text-blueGray-100 hover:bg-blueGray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
            </Layout>
        </>
    )
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context)

    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions?_sort=createdAt:desc&paymentStatus_in=SUCCESS&paymentStatus_in=PAID&paymentStatus_in=INACTIVE&paymentStatus_in=COMPLETED&paymentStatus_in=SUCCEEDED&paymentStatus_in=SETTLEMENT`,
        {
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        }
    )

    if (!data) return { props: { transactions: [] } }

    return {
        props: {
            transactions: data,
        },
    }
}

export default index
