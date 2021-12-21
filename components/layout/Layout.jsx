import { HiBadgeCheck, HiClock, HiTrendingUp } from 'react-icons/hi'
import { AiFillDashboard } from 'react-icons/ai'
import Divider from '../atoms/sidebar/Divider'
import NavItem from '../atoms/sidebar/NavItem'
import Sidebar from '../molecules/sidebar/Sidebar'
import { useSession } from 'next-auth/client'

const Layout = ({ children }) => {
    const [session, loading] = useSession()

    return (
        <div className='layout'>
            {/* Sidebar */}
            <Sidebar>
                {/* <NavItem href='/'>
                    <AiFillDashboard className='w-5 h-5' />
                    <span>Dashboard</span>
                </NavItem> */}
                {session?.user?.email != 'driver@gmail.com' && (
                    <>
                        <Divider label='orders' />
                        <NavItem href='/orders/requested-orders'>
                            <HiClock className='w-5 h-5' />
                            <span>Requested Orders</span>
                        </NavItem>
                        {/* <NavItem href='/orders/approved-orders'>
                            <HiBadgeCheck className='w-5 h-5' />
                            <span>Approved Orders</span>
                        </NavItem>
                        <Divider label='Histories' />
                        <NavItem href='/transactions'>
                            <HiTrendingUp className='w-5 h-5' />
                            <span>Transactions</span>
                        </NavItem> */}
                    </>
                )}
            </Sidebar>

            {/* Main Content */}
            <div className='flex-1 py-8 px-10 bg-blueGray-800 max-h-screen h-screen overflow-y-auto'>{children}</div>
        </div>
    )
}

export default Layout
