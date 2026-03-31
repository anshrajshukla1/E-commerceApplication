const initialState = {
    adminOrder: null,
    pagination: {},
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ADMIN_ORDERS":
            return {
                ...state,
                adminOrder: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
        case "UPDATE_ORDER_STATUS":
            return {
                ...state,
                adminOrder: (state.adminOrder || []).map((order) =>
                    order?.orderId === action.payload.orderId
                        ? {
                              ...order,
                              ...action.payload,
                          }
                        : order
                ),
            };
        default:
            return state;
    }
};
