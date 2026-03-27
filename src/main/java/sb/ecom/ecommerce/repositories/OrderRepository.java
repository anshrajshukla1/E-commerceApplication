package sb.ecom.ecommerce.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sb.ecom.ecommerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    @Query("SELECT COALESCE(SUM(o.totalAmount))  FROM Order o")


    Double getTotalRevenue();
}
