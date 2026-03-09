package sb.ecom.ecommerce.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private List<ProductDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private String sortBy;
    private String sortOrder;
    private Long totalElements;
    private Integer totalPages;
    private boolean lastPage;

}
