package sb.ecom.ecommerce.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.payload.AddressDTO;
import sb.ecom.ecommerce.service.AddressService;
import sb.ecom.ecommerce.util.AuthUtil;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {

    @Autowired
    AddressService addressService;

    @Autowired
    AuthUtil authUtil;

    @PostMapping("addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO){
        User user = authUtil.loggedInUser();
        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO,user);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddresses(){
        User user = authUtil.loggedInUser();
        List<AddressDTO> addressList = addressService.getUserAddresses(user);
        return new ResponseEntity<>(addressList,HttpStatus.OK);
    }

    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddressesById(@PathVariable Long addressId){
        AddressDTO addressList = addressService.getAddressesById(addressId);
        return new ResponseEntity<>(addressList,HttpStatus.OK);
    }

    @GetMapping("users/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByName(){
        User user = authUtil.loggedInUser();
        List<AddressDTO> addressDTOList = addressService.getUserAddresses(user);
        return new ResponseEntity<>(addressDTOList,HttpStatus.OK);
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updateAddressesById(@PathVariable Long addressId,
                                                          @RequestBody AddressDTO addressDTO){
        AddressDTO updatedAddress = addressService.updateAddressesById(addressId,addressDTO);
        return new ResponseEntity<>(updatedAddress,HttpStatus.OK);
    }

    @DeleteMapping("addresses/{addressId}")
    public ResponseEntity<String> deleteAddresses(@PathVariable Long addressId){
        String status = addressService.deleteById(addressId);
        return new ResponseEntity<>(status,HttpStatus.OK);
    }
}
