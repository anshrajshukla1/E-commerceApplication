import React, { useState } from 'react'
import Sidebar from '../shared/Sidebar'
import { Outlet } from 'react-router-dom'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { RxCross1 } from 'react-icons/rx';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
    let [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen'>

        {/* Mobile Sidebar */}
        <Dialog 
            open={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            className="relative z-50 xl:hidden">

            <DialogBackdrop 
                className="fixed inset-0 bg-gray-900/80"
            />

            <div className="fixed inset-0 flex">
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                    
                    <TransitionChild>
                        <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                            <button
                                type='button'
                                onClick={() => setSidebarOpen(false)}
                                className='p-2.5'>
                                <RxCross1 className='text-white text-2xl'/>
                            </button>
                        </div>
                    </TransitionChild>

                    <Sidebar />
                </DialogPanel>
            </div>
        </Dialog>

        {/* Desktop Sidebar */}
        <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
            <Sidebar />
        </div>

        {/* Main Content */}
        <div className='xl:pl-72'>
            
            {/* Top bar (mobile) */}
            <div className='sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-3 shadow-sm xl:hidden'>
                <button
                    type='button'
                    onClick={() => setSidebarOpen(true)}
                    className='text-gray-700'>
                    <FaBars className='text-2xl'/>
                </button>
            </div>

            <main>
                <div className='p-4 sm:p-6 xl:p-8'>
                    <Outlet />
                </div>
            </main>

        </div>
    </div>
  )
}

export default AdminLayout