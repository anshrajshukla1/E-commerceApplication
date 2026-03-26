import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPaymentMethod } from '../../store/actions';

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);

    return (
        <div className='max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border'>
            <h1 className='text-2xl font-semibold mb-4'>Select Payment Method</h1>

            <FormControl>
                <RadioGroup
                    value={paymentMethod || ""}
                    onChange={(e) => dispatch(addPaymentMethod(e.target.value))}
                >
                    <FormControlLabel
                        value="Stripe"
                        control={<Radio />}
                        label="Stripe"
                    />

                    <FormControlLabel
                        value="Paypal"
                        control={<Radio />}
                        label="Paypal"
                    />
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default PaymentMethod;
