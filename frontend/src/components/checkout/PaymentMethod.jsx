import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentMethod } from "../../store/actions";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const { paymentMethod } = useSelector((state) => state.payment);

  return (
    <div className="surface-card mx-auto mt-10 max-w-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <LuBadgeDollarSign className="text-2xl" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Select Payment Method</h1>
          <p className="text-sm text-slate-500">Choose how you want to complete this order.</p>
        </div>
      </div>

      <FormControl className="w-full">
        <RadioGroup
          value={paymentMethod || ""}
          onChange={(e) => dispatch(addPaymentMethod(e.target.value))}
          className="gap-4"
        >
          <FormControlLabel
            value="Stripe"
            control={<Radio />}
            label="Stripe"
            className="m-0 rounded-2xl border border-slate-200 bg-white px-4 py-4"
          />

          <FormControlLabel
            value="Paypal"
            control={<Radio />}
            label="Paypal"
            className="m-0 rounded-2xl border border-slate-200 bg-white px-4 py-4"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default PaymentMethod;
