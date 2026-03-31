const initialState = {
  products: null,
  categories: null,
  pagination: {},
}

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        pagination : {
            ...state.pagination,
            pageNumber : action.pageNumber,
            pageSize : action.pageSize,
            totalElements : action.totalElements,
            totalPages : action.totalPages,
           lastPage: action.lastPage,
        }
      }

       case "FETCH_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
         pagination : {
            ...state.pagination,
            pageNumber : action.pageNumber,
            pageSize : action.pageSize,
            totalElements : action.totalElements,
            totalPages : action.totalPages,
           lastPage: action.lastPage,
        }
      }
    case "ADD_DASHBOARD_PRODUCT":
      return {
        ...state,
        products: state.products ? [action.payload, ...state.products] : [action.payload],
      }
    case "UPDATE_DASHBOARD_PRODUCT":
      return {
        ...state,
        products: (state.products || []).map((product) =>
          product?.productId === action.payload.productId
            ? { ...product, ...action.payload }
            : product
        ),
      }
    case "DELETE_DASHBOARD_PRODUCT":
      return {
        ...state,
        products: (state.products || []).filter(
          (product) => product?.productId !== action.payload
        ),
      }


    default:
      return state
  }
}
