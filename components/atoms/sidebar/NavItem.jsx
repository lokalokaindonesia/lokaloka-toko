import Link from 'next/link'

const NavItem = ({ href, children }) => {
    return (
        <Link href={href} passHref={true}>
            <span className='cursor-pointer flex justify-start items-center space-x-2 py-2.5 px-4 rounded transition duration-200 hover:bg-blueGray-700 capitalize hover:text-white'>
                {children}
            </span>
        </Link>
    )
}

export default NavItem
