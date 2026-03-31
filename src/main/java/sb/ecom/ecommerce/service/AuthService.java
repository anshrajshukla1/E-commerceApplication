package sb.ecom.ecommerce.service;

import sb.ecom.ecommerce.payload.AuthenticationResult;
import sb.ecom.ecommerce.payload.UserResponse;
import sb.ecom.ecommerce.security.request.LoginRequest;
import sb.ecom.ecommerce.security.request.SignupRequest;
import sb.ecom.ecommerce.security.response.MessageResponse;
import sb.ecom.ecommerce.security.response.UserInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface AuthService {

    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllSellers(Pageable pageable);
}