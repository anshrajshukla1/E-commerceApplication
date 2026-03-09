package sb.ecom.ecommerce.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sb.ecom.ecommerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
}
