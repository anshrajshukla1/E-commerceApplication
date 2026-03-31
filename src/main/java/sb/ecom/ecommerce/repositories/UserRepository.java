package sb.ecom.ecommerce.repositories;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sb.ecom.ecommerce.model.AppRole;
import sb.ecom.ecommerce.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUserName(String username);
    Optional<User> findByEmail(String email);

    boolean existsByUserName(@NotBlank @Size(min = 3, max = 20) String userName);

    boolean existsByEmail(@NotBlank @Size(min = 3, max = 20) String userName);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = :role")
    Page<User> findByRoleName(@Param("role") AppRole role, Pageable pageable);
}
