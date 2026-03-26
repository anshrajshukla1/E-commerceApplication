const initialState = {
  isLoading: false,
  btnLoader: false,
  errorMessage: null,
  categoryLoader: false,
  categoryError: null,
};

export const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "IS_FETCHING":
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      };

    case "IS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        btnLoader: false,
        errorMessage: null,
      };

    case "IS_ERROR":
      return {
        ...state,
        isLoading: false,
        btnLoader: false,
        errorMessage: action.payload,
      };

    case "BUTTON_LOADER":
      return {
        ...state,
        btnLoader: true,
        errorMessage: null,
      };

    case "CATEGORY_SUCCESS":
      return {
        ...state,
        categoryLoader: false,
        categoryError: null,
      };

    case "CATEGORY_LOADER":
      return {
        ...state,
        categoryLoader: true,
        categoryError: null,
        errorMessage: null,
      };

    default:
      return state;
  }
};
