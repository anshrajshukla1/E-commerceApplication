import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import AddressInfo from './AddressInfo';
import { useDispatch, useSelector } from 'react-redux';
import { createUserCart, getUserAddresses, getUserCart } from '../../store/actions';
import toast from 'react-hot-toast';
import Skeleton from '../shared/Skeleton';
import ErrorPage from '../shared/ErrorPage';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import StripePayment from './StripePayment';

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutLoading, setCheckoutLoading] = useState(true);
    const [isSyncingCart, setIsSyncingCart] = useState(false);

    const dispatch = useDispatch();
    const initialLocalCartRef = useRef([]);

    const { errorMessage } = useSelector((state) => state.errors);
    const { cart, totalPrice, cartId } = useSelector((state) => state.carts);
    const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const { paymentMethod } = useSelector((state) => state.payment);

    const steps = [
        "Address",
        "Payment Method",
        "Order Summary",
        "Payment",
    ];

    useEffect(() => {
        const token = localStorage.getItem("token")?.trim();

        if (!token) {
            setCheckoutLoading(false);
            return;
        }

        initialLocalCartRef.current = cart;

        let isMounted = true;

        const loadCheckoutData = async () => {
            setCheckoutLoading(true);

            await Promise.all([
                dispatch(getUserAddresses()),
                dispatch(getUserCart()),
            ]);

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

        if (activeStep === 1 && !cartId && cart.length === 0 && initialLocalCartRef.current.length > 0) {
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
        <div className='py-14 min-h-[calc(100vh-100px)]'>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {checkoutLoading || isSyncingCart ? (
                <div className='lg:w-[80%] mx-auto py-5'>
                    <Skeleton />
                </div>
            ) : (
                <div className='mt-5'>
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

                    {activeStep === 3 && (
    <StripePayment/>
)}
                </div>
            )}

            <div
                className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200'
                style={{ boxShadow: "0 -2px 4px rgba(100, 100, 100, 0.15)" }}
            >
                <Button
                    variant='outlined'
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={`px-6 py-2 rounded-md font-medium border transition-all duration-200
                        ${
                            activeStep === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }
                    `}
                >
                    Back
                </Button>

                {activeStep !== steps.length - 1 && (
                    <button
                        disabled={Boolean(errorMessage) || isStepInvalid() || checkoutLoading || isSyncingCart}
                        onClick={handleNext}
                        className={`px-8 h-10 rounded-md font-semibold text-white transition-all duration-200
                            ${
                                errorMessage || isStepInvalid() || checkoutLoading || isSyncingCart
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-md"
                            }
                        `}
                    >
                        Proceed
                    </button>
                )}
            </div>

            {errorMessage && <ErrorPage message={errorMessage} />}
        </div>
    );
};

export default Checkout;
