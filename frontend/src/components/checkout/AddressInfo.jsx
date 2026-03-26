import React, { useState } from 'react';
import Skeleton from '../shared/Skeleton';
import { FaAddressBook } from 'react-icons/fa';
import AddressInfoModal from './AddressInfoModal';
import AddAddressForm from './AddAddressForm';
import { useDispatch, useSelector } from 'react-redux';
import AddressList from './AddressList';
import { DeleteModal } from './DeleteModal';
import toast from 'react-hot-toast';
import { deleteUserAddress } from '../../store/actions';

const AddressInfo = ({ address: addresses }) => {

    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const dispatch = useDispatch();
    const { isLoading, btnLoader } = useSelector((state) => state.errors);

    const noAddressExist = !addresses || addresses.length === 0;

    const addNewAddressHandler = () => {
        setSelectedAddress(null);
        setOpenAddressModal(true);
    };

    const deleteAddressHandler = () => {
        if (!selectedAddress) {
            toast.error("Please select an address to delete");
            return;
        }

        dispatch(deleteUserAddress(
            toast,
            selectedAddress.addressId,
            setOpenDeleteModal
        ));
    };

    return (
        <div className='pt-4'>

            {noAddressExist ? (
                <div className='p-6 rounded-lg max-w-md mx-auto flex flex-col items-center justify-center'>
                    <FaAddressBook size={50} className='text-gray-500 mb-4' />

                    <h1 className='mb-2 text-slate-900 text-center font-semibold text-2xl'>
                        No Address Added Yet
                    </h1>

                    <p className='mb-6 text-slate-800 text-center'>
                        Please add your address to complete purchase
                    </p>

                    <button
                        onClick={addNewAddressHandler}
                        className='px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all'>
                        Add Address
                    </button>
                </div>
            ) : (
                <div className='relative p-6 rounded-lg max-w-md mx-auto'>

                    <h1 className='text-slate-800 text-center font-bold text-2xl'>
                        Select Address
                    </h1>

                    {isLoading ? (
                        <div className='py-4 px-8'>
                            <Skeleton />
                        </div>
                    ) : (
                        <>
                            <div className='space-y-4 pt-6'>
                                <AddressList
                                    addresses={addresses}
                                    setSelectedAddress={setSelectedAddress}
                                    setOpenAddressModal={setOpenAddressModal}
                                    setOpenDeleteModal={setOpenDeleteModal}
                                />
                            </div>

                            <div className='mt-4 flex justify-between'>
                                <button
                                    onClick={addNewAddressHandler}
                                    className='px-4 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 transition-all'>
                                    Add More
                                </button>

                                <button
                                    onClick={() => setOpenDeleteModal(true)}
                                    className='px-4 py-2 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700 transition-all'>
                                    Delete Selected
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Add / Edit Modal */}
            <AddressInfoModal
                open={openAddressModal}
                setOpen={setOpenAddressModal}>
                <AddAddressForm
                    address={selectedAddress}
                    setOpenAddressModal={setOpenAddressModal}
                />
            </AddressInfoModal>

            {/* Delete Modal */}
            <DeleteModal
                open={openDeleteModal}
                loader={btnLoader}
                setOpen={setOpenDeleteModal}
                title="Delete Address"
                onDeleteHandler={deleteAddressHandler}
            />
        </div>
    );
};

export default AddressInfo;