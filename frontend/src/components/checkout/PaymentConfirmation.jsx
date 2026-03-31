import React, { useEffect, useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { stripePaymentConfirmation } from "../../store/actions";
import toast from "react-hot-toast";
import { Skeleton } from "@mui/material";

const PaymentConfirmation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const { cart } = useSelector((state) => state.carts);
  const [loading, setLoading] = useState(false);

  const paymentIntent = searchParams.get("payment_intent");
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const redirectStatus = searchParams.get("redirect_status");
  useEffect(() => {
    const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
      ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
      : [];
    const token = localStorage.getItem("token")?.trim();

    if (
      paymentIntent &&
      clientSecret &&
      redirectStatus &&
      token &&
      cart &&
      cart.length > 0
    ) {
      const sendData = {
        addressId: selectedUserCheckoutAddress.addressId,
        pgName: "Stripe",
        pgPaymentId: paymentIntent,
        pgStatus: "succeeded",
        pgResponseMessage: "Payment successful",
      };

      dispatch(
        stripePaymentConfirmation(sendData, setErrorMessage, setLoading, toast)
      );
    }
  }, [
    cart,
    clientSecret,
    dispatch,
    paymentIntent,
    redirectStatus,
  ]);

  return (
    <div className="page-section flex min-h-screen items-center justify-center py-14">
      {loading ? (
        <div className="surface-card mx-auto max-w-xl p-8">
          <Skeleton />
        </div>
      ) : (
        <div className="surface-card mx-auto max-w-md p-8 text-center">
          <div className="mb-4 flex justify-center text-green-500">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <LuBadgeCheck size={52} />
            </span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Payment Successful!
          </h2>
          <p className="mb-6 text-gray-600">
            Thank you for your purchase! Your payment was successful, and we are
            processing your order.
          </p>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
