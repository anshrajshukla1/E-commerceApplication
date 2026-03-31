import React, { useState } from "react";
import { LuMapPinned, LuPlus, LuTrash2 } from "react-icons/lu";
import Skeleton from "../shared/Skeleton";
import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import { useDispatch, useSelector } from "react-redux";
import AddressList from "./AddressList";
import { DeleteModal } from "./DeleteModal";
import toast from "react-hot-toast";
import { deleteUserAddress } from "../../store/actions";

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

    dispatch(deleteUserAddress(toast, selectedAddress.addressId, setOpenDeleteModal));
  };

  return (
    <div className="pt-4">
      {noAddressExist ? (
        <div className="surface-card mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-14 text-center">
          <LuMapPinned size={52} className="mb-4 text-slate-500" />

          <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
            No Address Added Yet
          </h1>

          <p className="mb-6 max-w-md text-center text-slate-500">
            Please add your address to complete purchase
          </p>

          <button onClick={addNewAddressHandler} className="btn-primary">
            <LuPlus />
            Add Address
          </button>
        </div>
      ) : (
        <div className="surface-card relative mx-auto max-w-4xl p-6">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Select Address
              </h1>
              <p className="text-sm text-slate-500">
                Choose the delivery address for this order.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="px-2 py-4">
              <Skeleton />
            </div>
          ) : (
            <>
              <div className="space-y-4 pt-2">
                <AddressList
                  addresses={addresses}
                  setSelectedAddress={setSelectedAddress}
                  setOpenAddressModal={setOpenAddressModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                />
              </div>

              <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
                <button onClick={addNewAddressHandler} className="btn-primary">
                  <LuPlus />
                  Add More
                </button>

                <button onClick={() => setOpenDeleteModal(true)} className="btn-danger">
                  <LuTrash2 />
                  Delete Selected
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm
          address={selectedAddress}
          setOpenAddressModal={setOpenAddressModal}
        />
      </AddressInfoModal>

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
