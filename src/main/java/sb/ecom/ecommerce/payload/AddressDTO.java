package sb.ecom.ecommerce.payload;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {



    private Long addressId;


    private String street;


    private String buildingName;


    private String city;


    @NotBlank
    @Size(min = 2, message = "State name must be atleast 2 characaters")
    private String state;
    private String country;

    private String pincode;
}
