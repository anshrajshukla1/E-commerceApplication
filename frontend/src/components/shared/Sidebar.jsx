import React from 'react'
import { FaTachometerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { adminNavigation, sellerNavigation } from '../../utils';
import classNames from 'classnames';

const Sidebar = ({isProfileLayout = false}) => {
    const pathName = useLocation().pathname;
    const { user } = useSelector((state) => state.auth);

    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

    const sideBarLayout = isAdmin ? adminNavigation : sellerNavigation;
    
  return (
    <div className='flex h-full min-h-screen grow flex-col gap-y-7 overflow-y-auto bg-gradient-to-b from-[#0f172a] to-[#1e293b] px-6 pb-4'>
        
        <div className='flex h-16 shrink-0 gap-x-3 pt-2 items-center'>
            <FaTachometerAlt className='h-8 w-8 text-indigo-500'/>
            <h1 className='text-white text-xl font-bold'>
                {isAdmin ? "Admin Panel" : "Seller Panel"}
            </h1>
        </div>

        <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                    <ul role='list' className='-mx-2 space-y-4'>
                        {sideBarLayout.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        pathName === item.href
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                        "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}>

                                        <item.icon className='text-xl'/>
                                        {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar