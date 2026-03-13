package sb.ecom.ecommerce.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.exceptions.ApiException;
import sb.ecom.ecommerce.exceptions.ResourceNotFoundException;
import sb.ecom.ecommerce.model.Category;
import sb.ecom.ecommerce.payload.CategoryDTO;
import sb.ecom.ecommerce.payload.CategoryResponse;
import sb.ecom.ecommerce.repositories.CategoryRepository;

import java.util.List;


@Service
public class CategoryServiceImplementation implements CategoryService{

//    private List<Category> categories = new ArrayList<>();



    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public CategoryResponse getAllCategories(Integer pageNumber,Integer pagesize,String sortBy,String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending(): Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber,pagesize,sortByAndOrder);
        Page<Category> categoryPage = categoryRepository.findAll(pageDetails);

        List<Category> categories = categoryPage.getContent();
        if (categories.isEmpty()){
            throw new ApiException("No categories created till now");
        }
        List<CategoryDTO> categoryDTOS = categories.stream().map(category -> modelMapper.map(category, CategoryDTO.class)).toList();
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

        Category category = modelMapper.map(categoryDTO,Category.class);

             Category categoryfromdb = categoryRepository.findByCategoryName(category.getCategoryName());
             if(categoryfromdb != null) {
                 throw new ApiException("Category with name "+ category.getCategoryName() + " already exists");
             }
             Category savedCategory = categoryRepository.save(category);
             return modelMapper.map(savedCategory, CategoryDTO.class);
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId).orElseThrow(()->new ResourceNotFoundException("categoryId", categoryId, "Category")
        );

            categoryRepository.delete(category);


            return modelMapper.map(category, CategoryDTO.class);

    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {


        Category savedCategory = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("categoryId", categoryId, "Category")
        );
        Category category = modelMapper.map(categoryDTO,Category.class);
        category.setCategoryId(categoryId);
        savedCategory = categoryRepository.save(category);
            return modelMapper.map(savedCategory, CategoryDTO.class);
        }
    }



