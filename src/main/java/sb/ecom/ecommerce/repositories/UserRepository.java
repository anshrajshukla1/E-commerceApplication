package sb.ecom.ecommerce.repositories;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import sb.ecom.ecommerce.model.User;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUserName(String username);

    boolean existsByUserName(@NotBlank @Size(min = 3, max = 20) String userName);

    boolean existsByEmail(@NotBlank @Size(min = 3, max = 20) String userName);


}
