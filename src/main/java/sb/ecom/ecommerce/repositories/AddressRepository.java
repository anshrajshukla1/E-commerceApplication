package sb.ecom.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sb.ecom.ecommerce.model.Address;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address,Long> {
    Optional<Address> findByAddressIdAndUserEmail(Long addressId, String email);
}
