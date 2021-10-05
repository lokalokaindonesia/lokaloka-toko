import { HiBadgeCheck, HiClock, HiTrendingUp } from 'react-icons/hi'
import Divider from '../atoms/sidebar/Divider'
import NavItem from '../atoms/sidebar/NavItem'
import Sidebar from '../molecules/sidebar/Sidebar'

const Layout = () => {
    return (
        <div className='layout'>
            {/* Sidebar */}
            <Sidebar>
                <Divider label='orders' />
                <NavItem href='/request-orders'>
                    <HiClock className='w-5 h-5' />
                    <span>Requested Orders</span>
                </NavItem>
                <NavItem href='/approved-orders'>
                    <HiBadgeCheck className='w-5 h-5' />
                    <span>Approved Orders</span>
                </NavItem>
                <Divider label='Histories' />
                <NavItem href='/transactions'>
                    <HiTrendingUp className='w-5 h-5' />
                    <span>Transactions</span>
                </NavItem>
            </Sidebar>

            {/* Main Content */}
            <div className='flex-1 p-10 text-2xl font-bold'>content goes here</div>
        </div>
    )
}

export default Layout
