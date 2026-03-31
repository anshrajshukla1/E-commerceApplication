import React, { useEffect } from "react";
import InputField from "../shared/InputField";
import { useForm } from "react-hook-form";
import { LuMapPinned } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import Spinners from "../shared/Spinners";
import toast from "react-hot-toast";
import { addUpdateUserAddress } from "../../store/actions";

const AddAddressForm = ({ address, setOpenAddressModal }) => {
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSaveAddressHandler = async (data) => {
    dispatch(
      addUpdateUserAddress(data, toast, address?.addressId, setOpenAddressModal)
    );
  };

  useEffect(() => {
    if (address?.addressId) {
      setValue("buildingName", address?.buildingName);
      setValue("city", address?.city);
      setValue("street", address?.street);
      setValue("state", address?.state);
      setValue("pincode", address?.pincode);
      setValue("country", address?.country);
    }
  }, [address, setValue]);

  return (
    <div className="w-full pt-6">
      <form onSubmit={handleSubmit(onSaveAddressHandler)}>
        <div className="mb-6 flex items-center justify-center gap-3 text-2xl font-semibold text-slate-800">
          <LuMapPinned className="text-2xl text-indigo-600" />
          {!address?.addressId ? "Add Address" : "Update Address"}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Building Name"
            required
            id="buildingName"
            type="text"
            message="*Building Name is required"
            placeholder="Enter Building Name"
            register={register}
            errors={errors}
          />

          <InputField
            label="City"
            required
            id="city"
            type="text"
            message="*City is required"
            placeholder="Enter City"
            register={register}
            errors={errors}
          />

          <InputField
            label="State"
            required
            id="state"
            type="text"
            message="*State is required"
            placeholder="Enter State"
            register={register}
            errors={errors}
          />

          <InputField
            label="Pincode"
            required
            id="pincode"
            type="text"
            message="*Pincode is required"
            placeholder="Enter Pincode"
            register={register}
            errors={errors}
          />

          <div className="md:col-span-2">
            <InputField
              label="Street"
              required
              id="street"
              type="text"
              message="*Street is required"
              placeholder="Enter Street"
              register={register}
              errors={errors}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              label="Country"
              required
              id="country"
              type="text"
              message="*Country is required"
              placeholder="Enter Country"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <button disabled={btnLoader} className="btn-primary mt-6 w-full" type="submit">
          {btnLoader ? (
            <>
              <Spinners /> Loading...
            </>
          ) : (
            "Save Address"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;
