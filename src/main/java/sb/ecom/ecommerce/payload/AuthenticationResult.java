package sb.ecom.ecommerce.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseCookie;
import sb.ecom.ecommerce.security.response.UserInfoResponse;


@Data
@AllArgsConstructor
public class AuthenticationResult {
    private final UserInfoResponse response;
    private final ResponseCookie jwtCookie;
}
