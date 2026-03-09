package sb.ecom.ecommerce.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.model.AppRole;
import sb.ecom.ecommerce.model.Role;
import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.repositories.RoleRepository;
import sb.ecom.ecommerce.repositories.UserRepository;
import sb.ecom.ecommerce.security.jwt.JwtUtils;
import sb.ecom.ecommerce.security.request.LoginRequest;
import sb.ecom.ecommerce.security.request.SignupRequest;
import sb.ecom.ecommerce.security.response.MessageResponse;
import sb.ecom.ecommerce.security.response.UserInfoResponse;
import sb.ecom.ecommerce.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateTokenFromUsername(userDetails.getUsername());
        System.out.println("JWT VALUE = " + jwt);
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles,jwt);


        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                jwtCookie.toString()).body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest){
        if(userRepository.existsByUserName(signupRequest.getUserName())){
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error : Username is already taken!"));
        }

        if(userRepository.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error : User email is already taken!"));
        }

        User user = new User(signupRequest.getUserName()
                ,signupRequest.getEmail()
                ,encoder.encode(signupRequest.getPassword())
        );
        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if(strRoles == null){
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseThrow(()-> new RuntimeException("Error : Role is not found"));
                     roles.add(userRole);

        } else{
            //admin --> ROLE_ADMIN
            //SELLER --> ROLE_SELLER
            strRoles.forEach(role->{
                switch(role){
                    case "admin":
                        Role adminrole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                                .orElseThrow(()-> new RuntimeException("Error : Role is not found"));
                        roles.add(adminrole);
                        break;
                    case "seller":
                        Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                                .orElseThrow(()-> new RuntimeException("Error : Role is not found"));
                        roles.add(sellerRole);
                        break;
                    default:  Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                            .orElseThrow(()-> new RuntimeException("Error : Role is not found"));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User Registered Successfully"));


    }


    @GetMapping("/username")
    public String currentUsername(Authentication authentication){
        if (authentication != null){
           return authentication.getName();
        }
        else{
            return "";
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfoResponse> getUserDetails(Authentication authentication){

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles);


        return ResponseEntity.ok().body(response);


    }

    @PostMapping("/signout")
    public ResponseEntity<?> signOutUser(){
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,
                cookie.toString()).body(new MessageResponse("You have been signed out "));
    }



}
