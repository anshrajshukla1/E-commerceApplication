package sb.ecom.ecommerce.service;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.exceptions.ApiException;
import sb.ecom.ecommerce.exceptions.ResourceNotFoundException;
import sb.ecom.ecommerce.model.Cart;
import sb.ecom.ecommerce.model.CartItem;
import sb.ecom.ecommerce.model.Product;
import sb.ecom.ecommerce.payload.CartDTO;
import sb.ecom.ecommerce.payload.CartItemDTO;
import sb.ecom.ecommerce.payload.ProductDTO;
import sb.ecom.ecommerce.repositories.CartItemRepository;
import sb.ecom.ecommerce.repositories.CartRepository;
import sb.ecom.ecommerce.repositories.ProductRepository;
import sb.ecom.ecommerce.util.AuthUtil;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public CartDTO addProductToCart(Long productid, Integer quantity) {
        Cart cart = createCart();
        Product product = productRepository.findById(productid)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productid, "productId"));

        if (product.getQuantity() == 0) {
            throw new ApiException(product.getProductName() + " is not available");
        }

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(
                cart.getCartID(),
                product.getProductId()
        );

        int updatedQuantity = quantity;
        if (cartItem != null) {
            updatedQuantity = cartItem.getQuantity() + quantity;
        }

        if (product.getQuantity() < updatedQuantity) {
            throw new ApiException("Please, make an order of the " + product.getProductName() + " less than or equal to the quantity " + product.getQuantity() + ".");
        }

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
        }

        cartItem.setQuantity(updatedQuantity);
        cartItem.setDiscount(product.getDiscount());
        cartItem.setProductPrice(product.getSpecialPrice());
        cartItemRepository.save(cartItem);

        refreshCartTotal(cart);
        return buildCartDTO(cart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        if (carts.isEmpty()) {
            throw new ApiException("No Carts Exist");
        }

        return carts.stream().map(this::buildCartDTO).toList();
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", cartId, "cartId");
        }
        return buildCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateProductQuanityInCart(Long productId, Integer quantity) {
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);

        if (cart == null) {
            throw new ResourceNotFoundException("Cart", 0L, "cartId");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cart.getCartID(), productId);
        if (cartItem == null) {
            throw new ApiException("Product " + product.getProductName() + " not available in the cart");
        }

        int newQuantity = cartItem.getQuantity() + quantity;

        if (newQuantity < 0) {
            throw new ApiException("The resulting quantity cannot be negative");
        }

        if (newQuantity == 0) {
            cartItemRepository.delete(cartItem);
        } else {
            if (product.getQuantity() < newQuantity) {
                throw new ApiException("Please, make an order of the " + product.getProductName() + " less than or equal to the quantity " + product.getQuantity() + ".");
            }

            cartItem.setQuantity(newQuantity);
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setDiscount(product.getDiscount());
            cartItemRepository.save(cartItem);
        }

        refreshCartTotal(cart);
        return buildCartDTO(cart);
    }

    @Transactional
    @Override
    public String deleteProductFromCart(Long cartId, Long productID) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", cartId, "CartId"));

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cartId, productID);
        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", productID, "Productid");
        }

        // 🔥 ONLY THIS — let Hibernate handle deletion
        cart.getCartItems().remove(cartItem);

        refreshCartTotal(cart);

        return "Product " + cartItem.getProduct().getProductName() + " removed from the cart !!!";
    }

    @Override
    public void updateProductInCarts(Long cartID, Long productId) {
        Cart cart = cartRepository.findById(cartID)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", cartID, "CartId"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cartID, productId);
        if (cartItem == null) {
            throw new ApiException("Product " + product.getProductName() + " not available in the cart");
        }

        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setDiscount(product.getDiscount());
        cartItemRepository.save(cartItem);

        refreshCartTotal(cart);
    }

    @Override
    @Transactional
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems) {
        Cart cart = createCart();

        for (CartItemDTO cartItemDTO : cartItems) {
            Long productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity() == null ? 0 : cartItemDTO.getQuantity();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

            CartItem existingCartItem = cartItemRepository.findByProductIdAndCartId(cart.getCartID(), productId);

            if (quantity <= 0) {
                if (existingCartItem != null) {
                    cartItemRepository.delete(existingCartItem);
                }
                continue;
            }

            if (product.getQuantity() < quantity) {
                throw new ApiException("Please, make an order of the " + product.getProductName() + " less than or equal to the quantity " + product.getQuantity() + ".");
            }

            if (existingCartItem == null) {
                existingCartItem = new CartItem();
                existingCartItem.setCart(cart);
                existingCartItem.setProduct(product);
            }

            existingCartItem.setQuantity(quantity);
            existingCartItem.setProductPrice(product.getSpecialPrice());
            existingCartItem.setDiscount(product.getDiscount());
            cartItemRepository.save(existingCartItem);
        }

        refreshCartTotal(cart);
        return "Cart updated successfully";
    }

    private Cart createCart() {
        Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        if (userCart != null) {
            return userCart;
        }

        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUser(authUtil.loggedInUser());
        return cartRepository.save(cart);
    }

    private void refreshCartTotal(Cart cart) {
        if (cart == null || cart.getCartID() == null) {
            return;
        }

        Cart freshCart = cartRepository.findById(cart.getCartID())
                .orElseThrow(() -> new ResourceNotFoundException("Cart", cart.getCartID(), "CartId"));

        List<CartItem> cartItems = cartItemRepository.findAllByCartId(freshCart.getCartID());

        double totalPrice = cartItems.stream()
                .filter(item -> item != null
                        && item.getQuantity() != null
                        && item.getProductPrice() != null)
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();

        freshCart.setTotalPrice(totalPrice);

        // 🔥 ADD THIS LINE (IMPORTANT)
        cartRepository.save(freshCart);
    }

    private CartDTO buildCartDTO(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findAllByCartId(cart.getCartID());
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cartDTO.setTotalPrice(
                cartItems.stream()
                        .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                        .sum()
        );
        cartDTO.setProducts(
                cartItems.stream()
                        .map(this::buildProductDTO)
                        .toList()
        );
        return cartDTO;
    }

    private ProductDTO buildProductDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        productDTO.setProductId(product.getProductId());
        productDTO.setProductName(product.getProductName());
        productDTO.setImage(product.getImage());
        productDTO.setQuantity(cartItem.getQuantity());
        productDTO.setSpecialPrice(cartItem.getProductPrice());
        productDTO.setDiscount(cartItem.getDiscount());
        return productDTO;
    }
}
