package sb.ecom.ecommerce.security.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.repositories.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       User user = userRepository.findByUserName(username)
               .or(() -> userRepository.findByEmail(username))
               .orElseThrow(() ->
                       new UsernameNotFoundException("User Not Found With Username or Email : " + username));

        return UserDetailsImpl.build(user);
    }
}
