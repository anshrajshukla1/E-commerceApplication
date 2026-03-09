package sb.ecom.ecommerce.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @NotBlank
    @Size(min = 5, message = "Street name must be atleast 5 characaters")
    private String street;

    @NotBlank
    @Size(min = 5, message = "Building name must be atleast 5 characaters")
    private String buildingName;


    @NotBlank
    @Size(min = 4, message = "City name must be atleast 4 characaters")
    private String city;


    @NotBlank
    @Size(min = 2, message = "State name must be atleast 2 characaters")
    private String state;


    @NotBlank
    @Size(min = 2, message = "Country name must be atleast 2 characaters")
    private String country;


    @NotBlank
    @Size(min = 6, message = "Pincode must be atleast 6 characaters")
    private String pincode;

    public Address( String pincode, String country, String state, String city, String buildingName, String street) {

        this.pincode = pincode;
        this.country = country;
        this.state = state;
        this.city = city;
        this.buildingName = buildingName;
        this.street = street;

    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private  User user;
}
