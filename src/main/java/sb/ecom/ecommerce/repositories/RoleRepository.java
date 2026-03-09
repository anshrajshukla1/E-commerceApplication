package sb.ecom.ecommerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sb.ecom.ecommerce.model.AppRole;
import sb.ecom.ecommerce.model.Role;


import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByRoleName(AppRole appRole);
}
