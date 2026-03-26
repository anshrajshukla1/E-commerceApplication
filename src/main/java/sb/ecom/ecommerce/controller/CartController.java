package sb.ecom.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.model.Cart;
import sb.ecom.ecommerce.payload.CartDTO;
import sb.ecom.ecommerce.payload.CartItemDTO;
import sb.ecom.ecommerce.repositories.CartRepository;
import sb.ecom.ecommerce.service.CartService;
import sb.ecom.ecommerce.util.AuthUtil;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/carts/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long productId,
                                                    @PathVariable Integer quantity){
        CartDTO cartDTO = cartService.addProductToCart(productId,quantity);
        return new ResponseEntity<>(cartDTO, HttpStatus.CREATED);
    }

    @GetMapping("/carts")
    public ResponseEntity<List<CartDTO>> getCards() {
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);

        if (cart == null) {
            return new ResponseEntity<>(List.of(), HttpStatus.OK);
        }

        CartDTO cartDTO = cartService.getCart(emailId, cart.getCartID());
        return new ResponseEntity<>(List.of(cartDTO), HttpStatus.OK);
    }

    @GetMapping("/carts/users/cart")
    public ResponseEntity<CartDTO> getCartById(){
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        Long cartId = cart.getCartID();
        CartDTO cartDTO = cartService.getCart(emailId,cartId);
        return new ResponseEntity<>(cartDTO, HttpStatus.OK);
    }

    @PutMapping("/cart/products/{productId}/quantity/{operation}")
    public ResponseEntity<CartDTO> updateCartProduct(@PathVariable Long productId,
                                                     @PathVariable String operation){
        CartDTO cartDTO= cartService.updateProductQuanityInCart(productId,
                operation.equalsIgnoreCase("delete") ? -1 : 1);

        return new ResponseEntity<>(cartDTO,HttpStatus.OK);
    }

    @DeleteMapping("/carts/{cartId}/product/{productId}")
    public ResponseEntity<String> deleteProductsFromCart(@PathVariable Long cartId,
                                                         @PathVariable Long productId){
        String status= cartService.deleteProductFromCart(cartId,productId);
        return new ResponseEntity<>(status,HttpStatus.OK);
    }

    @PostMapping("/cart/create-or-update")
    public ResponseEntity<String> createOrUpdateCart(
            @RequestBody List<CartItemDTO> cartItems
    ) {
        String response = cartService.createOrUpdateCartWithItems(cartItems);
        return ResponseEntity.ok(response);
    }
}
