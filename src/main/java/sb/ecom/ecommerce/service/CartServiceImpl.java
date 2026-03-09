package sb.ecom.ecommerce.service;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
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
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    public CartDTO addProductToCart(Long productid, Integer quantity) {
        //Find existing cart or create one
        Cart cart = createCart(); //defined below
        //Retrieve Product Details

        Product product = productRepository.findById(productid)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productid, "productId"));

        // Perform Validations
        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(
                cart.getCartID(),
                product.getProductId()
        );

        if (cartItem != null) {
            throw new ApiException("Product " + product.getProductName() + " already exists in the cart");
        }

        if (product.getQuantity() == 0) {
            throw new ApiException(product.getProductName() + " is not available");
        }
        if (product.getQuantity() < quantity) {
            throw new ApiException("Please, make an order of the " + product.getProductName() + "less than or equal to the quantity " + product.getQuantity() + ".");
        }


        // Create Cart Item
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());

        //Save Cart Item
        cartItemRepository.save(newCartItem);

        product.setQuantity(product.getQuantity()); //for future

        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));

        cartRepository.save(cart);
        // Return update cart
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);


        List<CartItem> cartItems = cart.getCartItems();
        Stream<ProductDTO> productStream = cartItems.stream().map(item -> {
            ProductDTO map = modelMapper.map(item.getProduct(), ProductDTO.class);
            map.setQuantity(item.getQuantity());
            return map;
        });
        cartDTO.setProducts(productStream.toList());

        return cartDTO;
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        if (carts.isEmpty()) {
            throw new ApiException("No Carts Exist");
        }
        List<CartDTO> cartDTOS = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = cart.getCartItems().stream().map(cartItem -> {
                ProductDTO productDTO = modelMapper.map(cartItem.getProduct(), ProductDTO.class);
                productDTO.setQuantity(cartItem.getQuantity()); // Set the quantity from CartItem
                return productDTO;
            }).collect(Collectors.toList());

            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();
        return cartDTOS;
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", cartId, "cartId");
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        cart.getCartItems().forEach(c->c.getProduct().setQuantity(c.getQuantity()));
        List<ProductDTO> products = cart.getCartItems().stream().
                map(p-> modelMapper.map(p.getProduct(),ProductDTO.class)).toList();
        cartDTO.setProducts(products);
        return cartDTO;
    }

    @Override
    @Transactional
    public CartDTO updateProductQuanityInCart(Long productId, Integer quantity) {

        String emailId= authUtil.loggedInEmail();
        Cart userCart = cartRepository.findCartByEmail(emailId);
        Long cartId = userCart.getCartID();

       Cart cart = cartRepository.findById(cartId)
               .orElseThrow(()->new ResourceNotFoundException("Cart",cartId,"CartId"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        if (product.getQuantity() == 0) {
            throw new ApiException(product.getProductName() + " is not available");
        }
        if (product.getQuantity() < quantity) {
            throw new ApiException("Please, make an order of the " + product.getProductName() + "less than or equal to the quantity " + product.getQuantity() + ".");
        }

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cartId,productId);
        if(cartItem==null){
            throw new ApiException("Product "+ product.getProductName()+ " not available in the cart");
        }

        int newQuantity = cartItem.getQuantity() + quantity;

        if(newQuantity < 0){
            throw new ApiException("The resulting quantity cannot be negative");
        }

        if (newQuantity ==0){
            deleteProductFromCart(cartId,productId);
        } else {


            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItem.setDiscount(product.getDiscount());
            cart.setTotalPrice(cart.getTotalPrice() + (cartItem.getProductPrice() * quantity));
            cartRepository.save(cart);

        }
        CartItem updatedItem = cartItemRepository.save(cartItem);
        if(updatedItem.getQuantity()== 0){
            cartItemRepository.deleteById(updatedItem.getCartItemId());
        }
        CartDTO cartDTO = modelMapper.map(cart,CartDTO.class);
        List<CartItem> cartItems = cart.getCartItems();

        Stream<ProductDTO> productStream = cartItems.stream().map(item ->{
            ProductDTO prd = modelMapper.map(item.getProduct(),ProductDTO.class);
            prd.setQuantity(item.getQuantity());
            return prd;
        });
        cartDTO.setProducts(productStream.toList());
        return cartDTO;
    }

    @Transactional
    @Override
    public String deleteProductFromCart(Long cartId, Long productID) {
       Cart cart = cartRepository.findById(cartId)
               .orElseThrow(()->new ResourceNotFoundException("Cart",cartId,"CartId"));

       CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cartId,productID);

       if (cartItem == null){
           throw new ResourceNotFoundException("Product",productID,"Productid");
       }

       cart.setTotalPrice(cart.getTotalPrice()-(cartItem.getProductPrice() * cartItem.getQuantity()));

       cartItemRepository.deleteCartItemByProductIdAndCartId(cartId,productID);
        return "Product " + cartItem.getProduct().getProductName() + "removed from the cart !!!";
    }

    @Override
    public void updateProductInCarts(Long cartID, Long productId) {
        Cart cart = cartRepository.findById(cartID)
                .orElseThrow(()->new ResourceNotFoundException("Cart",cartID,"CartId"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        CartItem cartItem = cartItemRepository.findByProductIdAndCartId(cartID, productId);

        if (cart == null){
            throw new ApiException("Product"+ product.getProductName() + "not available in the Cart");
        }

        double cartPrice = cart.getTotalPrice()- (cartItem.getProductPrice()* cartItem.getQuantity());
        cartItem.setProductPrice(product.getSpecialPrice());

        cart.setTotalPrice(cartPrice +
                (cartItem.getProductPrice()* cartItem.getQuantity()));

        cartItem = cartItemRepository.save(cartItem);
    }



    // helper method
    private Cart createCart() {
        Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        if (userCart != null) {
            return userCart;

        }
        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUser(authUtil.loggedInUser());
        Cart newCart = cartRepository.save(cart);
        return newCart;
    }

}
