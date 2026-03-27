package sb.ecom.ecommerce.service;

import jakarta.transaction.Transactional;
import sb.ecom.ecommerce.payload.OrderDTO;
import sb.ecom.ecommerce.payload.OrderResponse;

public interface OrderService {

    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

    OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
