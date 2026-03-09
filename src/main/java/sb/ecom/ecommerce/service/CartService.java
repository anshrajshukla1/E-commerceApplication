package sb.ecom.ecommerce.service;

import jakarta.transaction.Transactional;
import sb.ecom.ecommerce.payload.CartDTO;

import java.util.List;

public interface CartService {
    CartDTO addProductToCart(Long productid, Integer quantity);

    List<CartDTO> getAllCarts();

    CartDTO getCart(String emailId, Long cartId);


    @Transactional
    CartDTO updateProductQuanityInCart(Long productId, Integer quantity);

    String deleteProductFromCart(Long cartId, Long productID);

    void updateProductInCarts(Long cartID, Long productId);
}
