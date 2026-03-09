package sb.ecom.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sb.ecom.ecommerce.model.Address;
import sb.ecom.ecommerce.payload.AddressDTO;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
