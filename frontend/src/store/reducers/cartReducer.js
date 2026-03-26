const calculateTotalPrice = (cartItems = []) =>
  cartItems.reduce(
    (total, item) =>
      total + Number(item?.specialPrice || 0) * Number(item?.quantity || 0),
    0
  );

const initialState = {
  cart: [],
  totalPrice: 0,
  cartId: null,
  isLoading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "IS_FETCHING":
      return {
        ...state,
        isLoading: true,
      };

    case "IS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case "IS_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "GET_USER_CART_PRODUCTS":
      return {
        ...state,
        cart: action.payload || [],
        totalPrice: Number(action.totalPrice) || 0,
        cartId: action.cartId ?? null,
        error: null,
      };

    case "ADD_CART": {
      const product = action.payload;
      const existing = state.cart.find(
        (item) => item.productId === product.productId
      );

      const updatedCart = existing
        ? state.cart.map((item) =>
            item.productId === product.productId ? product : item
          )
        : [...state.cart, product];

      return {
        ...state,
        cart: updatedCart,
        totalPrice: calculateTotalPrice(updatedCart),
      };
    }

    case "REMOVE_CART": {
      const updatedCart = state.cart.filter(
        (item) => item.productId !== action.payload.productId
      );

      return {
        ...state,
        cart: updatedCart,
        totalPrice: calculateTotalPrice(updatedCart),
      };
    }

    case "LOG_OUT":
      return {
        ...initialState,
      };

      case "CLEAR_CART":
            return { cart:[], totalPrice: 0, cartId: null};

    default:
      return state;
  }
  
};
