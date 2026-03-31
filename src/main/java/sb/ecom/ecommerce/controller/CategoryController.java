package sb.ecom.ecommerce.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.config.AppConstants;
import sb.ecom.ecommerce.payload.CategoryDTO;
import sb.ecom.ecommerce.payload.CategoryResponse;
import sb.ecom.ecommerce.service.CategoryService;


@RestController
public class CategoryController {
  private CategoryService categoryService;


    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }


    @GetMapping("/api/echo")
    public ResponseEntity<String> echoMessage(@RequestParam(name = "message",defaultValue = "Ansh Here") String message){
        return  new ResponseEntity<>("Echoed message :"+ message,HttpStatus.OK);

    }


    @GetMapping("/api/public/categories")
    public ResponseEntity<CategoryResponse>  getAllCategories(@RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER)Integer pageNumber, @RequestParam(name ="pageSize", defaultValue = AppConstants.PAGE_SIZE) Integer pageSize, @RequestParam(name = "sortBy" , defaultValue = AppConstants.sortCategoriesBy)String sortBy, @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR)String sortOrder){
        CategoryResponse categoryResponse = categoryService.getAllCategories(pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(categoryResponse,HttpStatus.OK);
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO){
      CategoryDTO savedCategoryDTO=  categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(savedCategoryDTO,HttpStatus.CREATED);
    }

    @DeleteMapping("/api/admin/categories/{categoryId}")
    public ResponseEntity <CategoryDTO> deleteCategory(@PathVariable Long categoryId){
            CategoryDTO deletedCategory = categoryService.deleteCategory(categoryId);
            return new ResponseEntity<>(deletedCategory , HttpStatus.OK);
        }

    @PutMapping("/api/admin/categories/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO, @PathVariable Long categoryId){

          CategoryDTO savedCategoryDTO = categoryService.updateCategory(categoryDTO,categoryId);
          return new ResponseEntity<>(savedCategoryDTO,HttpStatus.OK);

    }
    }





