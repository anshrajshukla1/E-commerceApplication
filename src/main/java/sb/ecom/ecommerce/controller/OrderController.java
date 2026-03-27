package sb.ecom.ecommerce.controller;


import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.config.AppConstants;
import sb.ecom.ecommerce.payload.OrderDTO;
import sb.ecom.ecommerce.payload.OrderRequestDTO;
import sb.ecom.ecommerce.payload.OrderResponse;
import sb.ecom.ecommerce.payload.StripePaymentDto;
import sb.ecom.ecommerce.service.OrderService;
import sb.ecom.ecommerce.service.StripeService;
import sb.ecom.ecommerce.util.AuthUtil;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private StripeService stripeService;


    @PostMapping("order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()

        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);

    }

    @PostMapping("order/stripe-client-secret")
    public ResponseEntity<String> createStripeClientSecret(@RequestBody StripePaymentDto stripePaymentDto) {
        System.out.println("StripePaymentDTO Received " + stripePaymentDto);
        try {
            PaymentIntent paymentIntent = stripeService.paymentIntent(stripePaymentDto);
            return new ResponseEntity<>(paymentIntent.getClientSecret(), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Payment failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDER_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ) {
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<OrderResponse>(orderResponse, HttpStatus.OK);
    }
}


