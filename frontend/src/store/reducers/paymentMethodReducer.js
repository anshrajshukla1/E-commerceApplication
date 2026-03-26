const initialState = {
  paymentMethod: null,
  isLoading: false,
  error: null,
};

export const paymentMethodReducer = (state = initialState, action) => {
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

    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case "LOG_OUT":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
