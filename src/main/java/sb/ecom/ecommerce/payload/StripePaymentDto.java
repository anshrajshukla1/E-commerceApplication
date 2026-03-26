package sb.ecom.ecommerce.payload;

import lombok.Data;
import sb.ecom.ecommerce.model.Address;

import java.util.Map;

@Data
public class StripePaymentDto {
  private Long amount;
  private String currency;
  private String email;
  private String name;
  private Address address;
  private String description;
  private Map<String,String> metadata;
}
