import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { LuPanelRightClose } from 'react-icons/lu';

function Modal({ open, setOpen, children, title = ""}) {
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-closed:opacity-0" />
        
        <div className="fixed inset-0 overflow-hidden">
            <div className='absolute inset-0 overflow-hidden'>
                <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                    <DialogPanel transition
                        className='pointer-events-auto relative w-screen max-w-[800px] transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700'>
                            <div className='flex h-full flex-col overflow-y-scroll border-l border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl'>
                                <div className='px-4 sm:px-6'>
                                    <DialogTitle className='text-base font-semibold leading-6 text-gray-900'>
                                        Panel Title
                                    </DialogTitle>
                                </div>

                                <div className='relative mt-6 flex-1 p-8'>
                                    <div className='soft-divider flex items-center justify-between border-b pb-6'>
                                        <div>
                                          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-indigo-500'>Workspace</p>
                                          <h1 className='pt-2 text-2xl font-bold tracking-tight text-slate-900'>{title}</h1>
                                        </div>
                                        <button onClick={() => setOpen(false)} className='rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm hover:border-indigo-200 hover:text-indigo-600'>
                                            <LuPanelRightClose className='text-2xl'/>
                                        </button>
                                    </div>    
                                    {children}                                
                                </div>
                            </div>
                    </DialogPanel>
                </div>
            </div>
        </div>
      </Dialog>
    </>
  )
}


export default Modal;
