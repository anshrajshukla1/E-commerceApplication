package sb.ecom.ecommerce.service;

import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.payload.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);

    List<AddressDTO> getAddresses();

    AddressDTO getAddressesById(Long addressId);


    List<AddressDTO> getUserAddresses(User user);

    AddressDTO updateAddressesById(Long addressId, AddressDTO addressDTO);

    String deleteById(Long addressId);
}
