package sb.ecom.ecommerce.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sb.ecom.ecommerce.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
