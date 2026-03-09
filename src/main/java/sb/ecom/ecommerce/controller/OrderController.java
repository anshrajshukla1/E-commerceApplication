package sb.ecom.ecommerce.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.payload.OrderDTO;
import sb.ecom.ecommerce.payload.OrderRequestDTO;
import sb.ecom.ecommerce.service.OrderService;
import sb.ecom.ecommerce.util.AuthUtil;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AuthUtil authUtil;


    @PostMapping("order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO){
     String emailId= authUtil.loggedInEmail();
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

}
