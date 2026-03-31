import React from "react";
import {
  LuBadgeCheck,
  LuBuilding2,
  LuMapPin,
  LuMapPinned,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { selectUserCheckoutAddress } from "../../store/actions";

const AddressList = ({
  addresses,
  setSelectedAddress,
  setOpenAddressModal,
  setOpenDeleteModal,
}) => {
  const dispatch = useDispatch();
  const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  const onEditButtonHandler = (address) => {
    setSelectedAddress(address);
    setOpenAddressModal(true);
  };

  const onDeleteButtonHandler = (address) => {
    setSelectedAddress(address);
    setOpenDeleteModal(true);
  };

  const handleAddressSelection = (address) => {
    dispatch(selectUserCheckoutAddress(address));
  };

  if (!addresses || addresses.length === 0) {
    return <p className="text-center text-gray-500">No addresses available</p>;
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => {
        const isSelected =
          selectedUserCheckoutAddress?.addressId === address.addressId;

        return (
          <div
            key={address.addressId}
            onClick={() => handleAddressSelection(address)}
            className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
              isSelected
                ? "border-emerald-200 bg-emerald-50 shadow-[0_20px_40px_-30px_rgba(22,163,74,0.45)]"
                : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-[0_20px_40px_-30px_rgba(99,102,241,0.35)]"
            }`}
          >
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditButtonHandler(address);
                }}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-indigo-600"
              >
                <LuPencil size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteButtonHandler(address);
                }}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-red-600"
              >
                <LuTrash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LuBuilding2 className="text-slate-500" />
                <p className="font-semibold text-slate-900">{address.buildingName}</p>
                {isSelected ? <LuBadgeCheck className="text-emerald-600" /> : null}
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <LuMapPin className="text-slate-400" />
                <p>{address.street}</p>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <LuMapPinned className="text-slate-400" />
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
              </div>

              <p className="text-sm text-slate-500">{address.country}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressList;
