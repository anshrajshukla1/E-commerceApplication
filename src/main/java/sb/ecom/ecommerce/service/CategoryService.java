package sb.ecom.ecommerce.service;

import sb.ecom.ecommerce.model.Category;
import sb.ecom.ecommerce.payload.CategoryDTO;
import sb.ecom.ecommerce.payload.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize,String sortBy,String sortOrder);
    CategoryDTO createCategory(CategoryDTO categoryDTO);
    CategoryDTO deleteCategory(Long categoryId);
    CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId);

}

