package sb.ecom.ecommerce.exceptions;

public class ApiException extends RuntimeException{
    public static final long serialVersionUid = 1L;

    public ApiException() {
    }
    public ApiException(String message) {
        super(message);
    }


}
