package sb.ecom.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import sb.ecom.ecommerce.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartID= ?1 AND ci.product.productId = ?2")
    CartItem findByProductIdAndCartId(Long cartID, Long productId);

    @Modifying
    @Query("DELETE FROM CartItem ci where ci.cart.cartID = ?1 AND ci.product.productId = ?2")
    void deleteCartItemByProductIdAndCartId(Long cartId, Long productID);
}
