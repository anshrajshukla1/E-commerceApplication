import { Button, Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuShieldCheck } from "react-icons/lu";
import AddressInfo from "./AddressInfo";
import { useDispatch, useSelector } from "react-redux";
import { createUserCart, getUserAddresses, getUserCart } from "../../store/actions";
import toast from "react-hot-toast";
import Skeleton from "../shared/Skeleton";
import ErrorPage from "../shared/ErrorPage";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import StripePayment from "./StripePayment";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(() => {
    const token = localStorage.getItem("token")?.trim();
    return Boolean(token);
  });
  const [isSyncingCart, setIsSyncingCart] = useState(false);

  const dispatch = useDispatch();

  const { errorMessage } = useSelector((state) => state.errors);
  const { cart, totalPrice, cartId } = useSelector((state) => state.carts);
  const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
  const { paymentMethod } = useSelector((state) => state.payment);
  const initialLocalCartRef = useRef(cart);

  const steps = ["Address", "Payment Method", "Order Summary", "Payment"];

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();

    if (!token) {
      return;
    }

    let isMounted = true;

    const loadCheckoutData = async () => {
      setCheckoutLoading(true);

      await Promise.all([dispatch(getUserAddresses()), dispatch(getUserCart())]);

      if (isMounted) {
        setCheckoutLoading(false);
      }
    };

    loadCheckoutData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const isStepInvalid = () => {
    if (activeStep === 0) return !selectedUserCheckoutAddress;
    if (activeStep === 1) return !paymentMethod;
    return false;
  };

  const handleNext = async () => {
    if (activeStep === 0 && !selectedUserCheckoutAddress) {
      toast.error("Please select checkout address before proceeding.");
      return;
    }

    if (activeStep === 1 && (!selectedUserCheckoutAddress || !paymentMethod)) {
      toast.error("Please select address and payment method before proceeding.");
      return;
    }

    if (
      activeStep === 1 &&
      !cartId &&
      cart.length === 0 &&
      initialLocalCartRef.current.length > 0
    ) {
      setIsSyncingCart(true);
      const cartCreated = await dispatch(createUserCart(initialLocalCartRef.current));
      setIsSyncingCart(false);

      if (!cartCreated) {
        return;
      }

      initialLocalCartRef.current = [];
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <div className="page-section min-h-[calc(100vh-100px)] py-12 pb-36">
      <div className="surface-card mb-8 px-6 py-8">
        <div className="mb-8 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            <LuShieldCheck />
            Secure checkout
          </span>
          <h1 className="section-heading !text-[2.6rem]">Checkout</h1>
          <p className="section-subtext">
            Review your order in clear steps: cart details, delivery address, payment method, and confirmation.
          </p>
        </div>

        <Stepper activeStep={activeStep} alternativeLabel className="checkout-stepper">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {checkoutLoading || isSyncingCart ? (
        <div className="surface-card mx-auto py-5 lg:w-[80%]">
          <Skeleton />
        </div>
      ) : (
        <div className="mt-5">
          {activeStep === 0 && <AddressInfo address={address} />}
          {activeStep === 1 && <PaymentMethod />}
          {activeStep === 2 && (
            <OrderSummary
              totalPrice={totalPrice}
              cart={cart}
              address={selectedUserCheckoutAddress}
              paymentMethod={paymentMethod}
            />
          )}

          {activeStep === 3 && <StripePayment />}
        </div>
      )}

      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/70 bg-white/90 px-4 py-4 shadow-[0_-18px_40px_-32px_rgba(15,23,42,0.4)] backdrop-blur-xl">
        <div className="page-section flex items-center justify-between">
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            className={`!rounded-2xl !px-6 !py-3 !font-semibold !normal-case ${
              activeStep === 0
                ? "!border-slate-200 !bg-slate-100 !text-slate-400"
                : "!border-slate-300 !bg-white !text-slate-700"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <LuArrowLeft />
              Back
            </span>
          </Button>

          {activeStep !== steps.length - 1 && (
            <button
              disabled={Boolean(errorMessage) || isStepInvalid() || checkoutLoading || isSyncingCart}
              onClick={handleNext}
              className={`inline-flex h-12 items-center gap-2 rounded-2xl px-8 font-semibold text-white transition-all duration-200 ${
                errorMessage || isStepInvalid() || checkoutLoading || isSyncingCart
                  ? "cursor-not-allowed bg-indigo-300"
                  : "bg-gradient-to-r from-indigo-500 to-sky-500 shadow-[0_20px_35px_-22px_rgba(99,102,241,0.9)] hover:scale-105"
              }`}
            >
              Proceed
              <LuArrowRight />
            </button>
          )}
        </div>
      </div>

      {errorMessage && <ErrorPage message={errorMessage} />}
    </div>
  );
};

export default Checkout;
