package sb.ecom.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.payload.StripePaymentDto;


public interface StripeService {

    PaymentIntent paymentIntent(StripePaymentDto stripePaymentDto) throws StripeException;
}
