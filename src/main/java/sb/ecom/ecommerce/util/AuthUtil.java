package sb.ecom.ecommerce.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.repositories.UserRepository;

@Component
public class AuthUtil {

    @Autowired
    UserRepository userRepository;

    private User resolveLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String subject = authentication.getName();
        System.out.println("LOGGED_IN_IDENTIFIER = " + subject);

        return userRepository.findByEmail(subject)
                .or(() -> userRepository.findByUserName(subject))
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with identifier: " + subject));
    }

    public String loggedInEmail(){
        return resolveLoggedInUser().getEmail();
    }

    public Long loggedInUserId(){
        return resolveLoggedInUser().getUserId();
    }

    public User loggedInUser(){
        return resolveLoggedInUser();
    }
}
