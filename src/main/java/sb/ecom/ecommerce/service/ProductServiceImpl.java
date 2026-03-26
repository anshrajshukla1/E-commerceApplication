package sb.ecom.ecommerce.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sb.ecom.ecommerce.exceptions.ApiException;
import sb.ecom.ecommerce.exceptions.ResourceNotFoundException;
import sb.ecom.ecommerce.model.Cart;
import sb.ecom.ecommerce.model.Category;
import sb.ecom.ecommerce.model.Product;
import sb.ecom.ecommerce.payload.CartDTO;
import sb.ecom.ecommerce.payload.ProductDTO;
import sb.ecom.ecommerce.payload.ProductResponse;
import sb.ecom.ecommerce.repositories.CartRepository;
import sb.ecom.ecommerce.repositories.CategoryRepository;
import sb.ecom.ecommerce.repositories.ProductRepository;

import java.io.IOException;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Override
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId, "categoryId"));

        boolean isProductNotPresent = true;
        List<Product> products = category.getProducts();

        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getProductName().equals(productDTO.getProductName())) {
                isProductNotPresent = false;
                break;
            }
        }

        if (isProductNotPresent) {
            Product product = modelMapper.map(productDTO, Product.class);
            product.setCategory(category);
            product.setImage("default.png");

            double specialPrice = product.getPrice() - (product.getDiscount() * 0.01) * product.getPrice();
            product.setSpecialPrice(specialPrice);

            Product savedProduct = productRepository.save(product);
            return modelMapper.map(savedProduct, ProductDTO.class);

        } else {
            throw new ApiException("Product Already Exists");
        }
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber,
                                          Integer pageSize,
                                          String sortBy,
                                          String sortOrder,
                                          String keyword,
                                          String category) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        // FIX 1: initialize spec safely (no null crash)
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        // FIX 2: keyword filter (case-insensitive)
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(
                            cb.lower(root.get("productName")),
                            "%" + keyword.toLowerCase() + "%"
                    )
            );
        }

        // FIX 3: category filter (case-insensitive)
        if (category != null && !category.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(
                            cb.lower(root.get("category").get("categoryName")),
                            category.toLowerCase()
                    )
            );
        }

        Page<Product> pageProducts = productRepository.findAll(spec, pageDetails);

        List<Product> products = pageProducts.getContent();

        List<ProductDTO> productDTOS = products.stream().map(product -> {
            ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
            productDTO.setImage(constructImageUrl(product.getImage()));
            return productDTO;
        }).toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ?
                imageBaseUrl + imageName :
                imageBaseUrl + "/" + imageName;
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId, "categoryId"));

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByCategoryOrderByPriceAsc(category, pageDetails);

        List<Product> products = pageProducts.getContent();

        if (products.isEmpty()) {
            throw new ApiException(category.getCategoryName() + " category does not have any products");
        }

        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository
                .findByProductNameLikeIgnoreCase("%" + keyword + "%", pageDetails);

        List<Product> products = pageProducts.getContent();

        if (products.isEmpty()) {
            throw new ApiException("Products not found with keyword :" + keyword);
        }

        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public ProductDTO updateProduct(ProductDTO productDTO, Long productId) {

        Product productFromDb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        Product product = modelMapper.map(productDTO, Product.class);

        productFromDb.setProductName(product.getProductName());
        productFromDb.setProductDescription(product.getProductDescription());
        productFromDb.setQuantity(product.getQuantity());
        productFromDb.setDiscount(product.getDiscount());
        productFromDb.setPrice(product.getPrice());
        productFromDb.setSpecialPrice(product.getSpecialPrice());

        Product savedProduct = productRepository.save(productFromDb);

        List<Cart> carts = cartRepository.findCartsByProductId(productId);

        List<CartDTO> cartDTOS = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class))
                    .toList();
            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();

        cartDTOS.forEach(cart -> cartService.updateProductInCarts(cart.getCartID(), productId));

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        List<Cart> carts = cartRepository.findCartsByProductId(productId);

        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartID(), productId));

        productRepository.delete(product);

        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {

        Product productfromdb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId, "productId"));

        String fileName = fileService.uploadImage(path, image);

        productfromdb.setImage(fileName);

        Product updatedProduct = productRepository.save(productfromdb);

        return modelMapper.map(updatedProduct, ProductDTO.class);
    }
}