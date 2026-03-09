package sb.ecom.ecommerce.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sb.ecom.ecommerce.exceptions.ResourceNotFoundException;
import sb.ecom.ecommerce.model.Address;
import sb.ecom.ecommerce.model.User;
import sb.ecom.ecommerce.payload.AddressDTO;
import sb.ecom.ecommerce.repositories.AddressRepository;
import sb.ecom.ecommerce.repositories.UserRepository;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService{

     @Autowired
     ModelMapper modelMapper;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;


    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address = modelMapper.map(addressDTO,Address.class);

        List<Address> addressList = user.getAddresses();
        addressList.add(address);
        user.setAddresses(addressList);

        address.setUser(user);
        Address savedAddress = addressRepository.save(address);


        return modelMapper.map(savedAddress,AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses = addressRepository.findAll();
       List<AddressDTO> addressDTOS = addresses.stream()
                .map(address -> modelMapper.map(address,AddressDTO.class))
                .toList();

        return addressDTOS;
    }

    @Override
    public AddressDTO getAddressesById(Long addressId) {
         Address address = addressRepository.findById(addressId).orElseThrow(()->new ResourceNotFoundException("Address",addressId,"AdrressId"));
         return modelMapper.map(address,AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getUserAddresses(User user) {
        List<Address> addresses = user.getAddresses();
       return addresses.stream()
                .map(address -> modelMapper.map(address,AddressDTO.class))
                .toList();

    }

    @Override
    public AddressDTO updateAddressesById(Long addressId, AddressDTO addressDTO) {
        Address addressFromDatabase= addressRepository.findById(addressId)
                .orElseThrow(()->new ResourceNotFoundException("Address",addressId,"AdrressId"));

        addressFromDatabase.setCity(addressDTO.getCity());
        addressFromDatabase.setPincode(addressDTO.getState());
        addressFromDatabase.setState(addressDTO.getState());
        addressFromDatabase.setCountry(addressDTO.getCountry());
        addressFromDatabase.setStreet(addressDTO.getStreet());
        addressFromDatabase.setBuildingName(addressDTO.getBuildingName());

        Address updateAddress = addressRepository.save(addressFromDatabase);
        User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        user.getAddresses().add(updateAddress);

        userRepository.save(user);

        return modelMapper.map(updateAddress, AddressDTO.class);
    }

    @Override
    public String deleteById(Long addressId) {
        Address addressFromDatabase= addressRepository.findById(addressId)
                .orElseThrow(()->new ResourceNotFoundException("Address",addressId,"AdrressId"));
           User user = addressFromDatabase.getUser();
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        userRepository.save(user);

        addressRepository.delete(addressFromDatabase);
        return "Address deleted successfully with addressId: " +addressId ;
    }


}
