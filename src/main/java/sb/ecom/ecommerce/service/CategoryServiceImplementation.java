package sb.ecom.ecommerce.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.exceptions.ApiException;
import sb.ecom.ecommerce.exceptions.ResourceNotFoundException;
import sb.ecom.ecommerce.model.Category;
import sb.ecom.ecommerce.payload.CategoryDTO;
import sb.ecom.ecommerce.payload.CategoryResponse;
import sb.ecom.ecommerce.repositories.CategoryRepository;

import java.util.List;
import java.util.Set;

@Service
public class CategoryServiceImplementation implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ✅ Allowed fields (future-safe & scalable)
    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("categoryId", "categoryName");

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pagesize,
                                             String sortBy, String sortOrder) {

        // ✅ Default values (safe handling)
        pageNumber = (pageNumber == null || pageNumber < 0) ? 0 : pageNumber;
        pagesize = (pagesize == null || pagesize <= 0) ? 5 : pagesize;

        sortBy = (sortBy == null || sortBy.isBlank()) ? "categoryId" : sortBy;
        sortOrder = (sortOrder == null || sortOrder.isBlank()) ? "asc" : sortOrder;

        // ✅ Handle nested fields like "category.categoryId"
        if (sortBy.contains(".")) {
            sortBy = sortBy.substring(sortBy.lastIndexOf(".") + 1);
        }

        // ✅ Strict validation (production-safe)
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new ApiException("Invalid sort field: " + sortBy +
                    ". Allowed fields: " + ALLOWED_SORT_FIELDS);
        }

        // ✅ Safe sort order handling
        Sort.Direction direction = sortOrder.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sort = Sort.by(direction, sortBy);

        Pageable pageDetails = PageRequest.of(pageNumber, pagesize, sort);

        Page<Category> categoryPage = categoryRepository.findAll(pageDetails);

        List<Category> categories = categoryPage.getContent();

        if (categories.isEmpty()) {
            throw new ApiException("No categories created till now");
        }

        List<CategoryDTO> categoryDTOS = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();

        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setContent(categoryDTOS);
        categoryResponse.setPageNumber(categoryPage.getNumber());
        categoryResponse.setPageSize(categoryPage.getSize());
        categoryResponse.setTotalElements(categoryPage.getTotalElements());
        categoryResponse.setTotalPages(categoryPage.getTotalPages());
        categoryResponse.setLastPage(categoryPage.isLast());

        return categoryResponse;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {

        Category category = modelMapper.map(categoryDTO, Category.class);

        Category categoryFromDb =
                categoryRepository.findByCategoryName(category.getCategoryName());

        if (categoryFromDb != null) {
            throw new ApiException("Category with name " +
                    category.getCategoryName() + " already exists");
        }

        Category savedCategory = categoryRepository.save(category);

        return modelMapper.map(savedCategory, CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("categoryId",
                                categoryId, "Category"));

        categoryRepository.delete(category);

        return modelMapper.map(category, CategoryDTO.class);
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {

        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("categoryId",
                                categoryId, "Category"));

        Category category = modelMapper.map(categoryDTO, Category.class);
        category.setCategoryId(categoryId);

        Category updatedCategory = categoryRepository.save(category);

        return modelMapper.map(updatedCategory, CategoryDTO.class);
    }


}