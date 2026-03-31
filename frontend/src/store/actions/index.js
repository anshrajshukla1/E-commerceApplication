import api from "../../api/api";

const setCartState = (dispatch, cartData) => {
  dispatch({
    type: "GET_USER_CART_PRODUCTS",
    payload: cartData?.products || [],
    totalPrice: Number(cartData?.totalPrice) || 0,
    cartId: cartData?.cartID || cartData?.cartId || null,
  });
};

export const fetchProducts = (queryString) => async (dispatch) => {
  try {
    const safeQueryString =
      queryString && queryString !== "undefined" ? queryString : "";
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/products?${safeQueryString}`);
    dispatch({ type: "FETCH_PRODUCTS", payload: data.content });
    dispatch({ type: "IS_SUCCESS" });
  } catch {
    dispatch({ type: "IS_ERROR", payload: "Failed to fetch products" });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });
    const { data } = await api.get(`/public/categories`);
    dispatch({ type: "FETCH_CATEGORIES", payload: data.content });
  } catch {
    dispatch({ type: "IS_ERROR", payload: "Failed to fetch categories" });
  } finally {
    dispatch({ type: "CATEGORY_SUCCESS" });
  }
};

export const addToCart = (data, qty = 1, toast) => async (dispatch, getState) => {
  const previousCartState = getState().carts;

  try {
    const existingCartItem = previousCartState.cart.find(
      (item) => item.productId === data.productId
    );
    const optimisticCartItem = {
      ...data,
      quantity: Number(existingCartItem?.quantity || 0) + qty,
      specialPrice: data?.specialPrice || data?.price || 0,
    };

    dispatch({ type: "ADD_CART", payload: optimisticCartItem });
    const { data: cartData } = await api.post(
      `/carts/products/${data.productId}/quantity/${qty}`
    );
    setCartState(dispatch, cartData);
    dispatch({ type: "IS_SUCCESS" });
    toast.success(`${data?.productName} added`);
  } catch (error) {
    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: previousCartState.cart,
      totalPrice: previousCartState.totalPrice,
      cartId: previousCartState.cartId,
    });
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to add product to cart",
    });
    toast.error(error?.response?.data?.message || "Failed to add product to cart");
  }
};

export const increaseCartQuantity = (data, toast) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data: cartData } = await api.put(
      `/cart/products/${data.productId}/quantity/add`
    );
    setCartState(dispatch, cartData);
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to update quantity",
    });
    toast.error(error?.response?.data?.message || "Failed to update quantity");
  }
};

export const decreaseCartQuantity = (data, toast) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data: cartData } = await api.put(
      `/cart/products/${data.productId}/quantity/delete`
    );
    setCartState(dispatch, cartData);
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to update quantity",
    });
    toast.error(error?.response?.data?.message || "Failed to update quantity");
  }
};

export const removeFromCart = (data, toast) => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const cartId = getState().carts.cartId;

    if (!cartId) {
      dispatch({ type: "REMOVE_CART", payload: data });
      dispatch({ type: "IS_SUCCESS" });
      toast.success("Item removed");
      return;
    }

    await api.delete(`/carts/${cartId}/product/${data.productId}`);
    const refreshedCart = await dispatch(getUserCart());

    if (!refreshedCart) {
      dispatch({
        type: "GET_USER_CART_PRODUCTS",
        payload: [],
        totalPrice: 0,
        cartId: null,
      });
      dispatch({ type: "IS_SUCCESS" });
    }

    toast.success("Item removed");
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to remove product",
    });
    toast.error(error?.response?.data?.message || "Failed to remove product");
  }
};

export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/signin", sendData);
      const jwtToken = data?.jwtToken?.trim();

      if (!jwtToken) {
        throw new Error("Missing authentication token");
      }

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("CHECKOUT_ADDRESS");
      dispatch({ type: "LOG_OUT" });

      localStorage.setItem("auth", JSON.stringify(data));
      localStorage.setItem("token", jwtToken);

      dispatch({ type: "LOGIN_USER", payload: data });
      await Promise.all([dispatch(getUserCart()), dispatch(getUserAddresses())]);

      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Login Failed"
      );
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => (dispatch) => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("CHECKOUT_ADDRESS");
  dispatch({ type: "LOG_OUT" });
  navigate("/login");
};

export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) => async () => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/signup", sendData);
      reset();
      toast.success(data?.message || "User Registered Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const addUpdateUserAddress =
  (sendData, toast, addressId, setOpenAddressModal) => async (dispatch) => {
    dispatch({ type: "BUTTON_LOADER" });
    try {
      if (!addressId) {
        await api.post("/addresses", sendData);
      } else {
        await api.put(`/addresses/${addressId}`, sendData);
      }

      await dispatch(getUserAddresses());
      toast.success("Address saved successfully");
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal Server Error");
      dispatch({ type: "IS_ERROR", payload: null });
    } finally {
      setOpenAddressModal(false);
    }
  };

export const deleteUserAddress =
  (toast, addressId, setOpenDeleteModal) => async (dispatch) => {
    try {
      dispatch({ type: "BUTTON_LOADER" });
      await api.delete(`/addresses/${addressId}`);
      dispatch(clearCheckoutAddress());
      await dispatch(getUserAddresses());
      dispatch({ type: "IS_SUCCESS" });
      toast.success("Address deleted successfully");
    } catch (error) {
      dispatch({
        type: "IS_ERROR",
        payload: error?.response?.data?.message || "Some Error Occured",
      });
    } finally {
      setOpenDeleteModal(false);
    }
  };

export const clearCheckoutAddress = () => ({ type: "REMOVE_CHECKOUT_ADDRESS" });

export const getUserAddresses = () => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/users/addresses");
    dispatch({ type: "USER_ADDRESS", payload: data });
    dispatch({ type: "IS_SUCCESS" });
    return data;
  } catch {
    dispatch({ type: "IS_ERROR", payload: "Failed to fetch user addresses" });
    return [];
  }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};


export const addPaymentMethod = (method) => ({
  type: "ADD_PAYMENT_METHOD",
  payload: method,
});

export const createUserCart = (sendCartItems) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const payload = Object.values(
      (sendCartItems || []).reduce((accumulator, item) => {
        const productId = item.productId;
        const quantity = Number(item.quantity) || 0;

        if (!productId || quantity <= 0) {
          return accumulator;
        }

        accumulator[productId] = {
          productId,
          quantity,
        };

        return accumulator;
      }, {})
    );

    if (payload.length === 0) {
      dispatch({ type: "IS_SUCCESS" });
      return false;
    }

    await api.post("/cart/create-or-update", payload);
    await dispatch(getUserCart());
    return true;
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to create cart",
    });
    return false;
  }
};

export const getUserCart = () => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/carts/users/cart");
    const products = Array.isArray(data?.products) ? data.products : [];
    const totalPrice = Number(data?.totalPrice) || 0;
    const cartId = data?.cartID || data?.cartId || null;

    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: products,
      totalPrice,
      cartId,
    });
    dispatch({ type: "IS_SUCCESS" });
    return { products, totalPrice, cartId };
  } catch (error) {
    if (error?.response?.status === 404) {
      dispatch({
        type: "GET_USER_CART_PRODUCTS",
        payload: [],
        totalPrice: 0,
        cartId: null,
      });
      dispatch({ type: "IS_SUCCESS" });
      return { products: [], totalPrice: 0, cartId: null };
    }

    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch cart",
    });
    return null;
  }
};

export const createStripePaymentSecret 
    = (sendData) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", sendData);
            dispatch({ type: "CLIENT_SECRET", payload: data });
              localStorage.setItem("client-secret", JSON.stringify(data));
              dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create client secret");
        }
};

export const stripePaymentConfirmation 
    = (sendData, setErrorMesssage, setLoadng, toast) => async (dispatch, getState) => {
        try {
            const response  = await api.post("/order/users/payments/online", sendData);
            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("client-secret");
                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
                dispatch({ type: "CLEAR_CART"});
                toast.success("Order Accepted");
              } else {
                setErrorMesssage("Payment Failed. Please try again.");
              }
        } catch (error) {
            setErrorMesssage("Payment Failed. Please try again.");
        }
};

export const analyticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING"});
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS"});
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
            });
        }
};

export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
    try {
        const safeQueryString =
            typeof queryString === "string" && queryString !== "undefined"
                ? queryString
                : "";

        if (!safeQueryString) return;

        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const { data } = await api.get(`${endpoint}?${safeQueryString}`);
        dispatch({
            type: "GET_ADMIN_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
         });
    }
};

export const updateOrderStatusFromDashboard =
     (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch, getState) => {
    try {
        const { user } = getState().auth;
        const roles = user?.roles || [];
        const safeQueryString = new URLSearchParams(window.location.search).toString();

        if (!roles.includes("ROLE_SELLER") && !roles.includes("ROLE_ADMIN")) {
            return;
        }

        setLoader(true);
        const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
        const { data } = await api.put(`${endpoint}${orderId}/status`, { status: orderStatus});
        dispatch({
            type: "UPDATE_ORDER_STATUS",
            payload: data,
        });
        toast.success("Order updated successfully");
        await dispatch(getOrdersForDashboard(safeQueryString, isAdmin));
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal Server Error");
        return false;
    } finally {
        setLoader(false)
    }
};

export const dashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        const safeQueryString =
            queryString && queryString !== "undefined" ? queryString : "";

        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/products" : "/seller/products";
        const { data } = await api.get(`${endpoint}?${safeQueryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard products",
         });
    }
};

const getDashboardProductsQueryString = (queryString) => {
    const fallbackQueryString = new URLSearchParams(window.location.search).toString();
    const sourceQueryString =
        queryString && queryString !== "undefined" ? queryString : fallbackQueryString;

    const searchParams = new URLSearchParams(sourceQueryString);
    const currentPage = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;

    searchParams.delete("page");
    searchParams.set("pageNumber", currentPage - 1);

    return searchParams.toString();
};

export const updateProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin, queryString) => async (dispatch) => {
    try {
        const safeQueryString = getDashboardProductsQueryString(queryString);
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        const { data } = await api.put(`${endpoint}${sendData.id}`, sendData);
        dispatch({
            type: "UPDATE_DASHBOARD_PRODUCT",
            payload: data,
        });
        toast.success("Product update successful");
        reset();
        setOpen(false);
        await dispatch(dashboardProductsAction(safeQueryString, isAdmin));
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error?.response?.data?.description ||
            "Product update failed"
        );
    } finally {
        setLoader(false);
    }
};

export const addNewProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin, queryString) => async(dispatch, getState) => {
        try {
            const safeQueryString = getDashboardProductsQueryString(queryString);
            setLoader(true);
            if (!sendData?.categoryId) {
                toast.error("Category is required");
                return;
            }
            const { categoryId, ...payload } = sendData;
            const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
            const { data } = await api.post(`${endpoint}${categoryId}/product`, payload);
            dispatch({
                type: "ADD_DASHBOARD_PRODUCT",
                payload: data,
            });
            toast.success("Product created successfully");
            reset();
            setOpen(false);
            await dispatch(dashboardProductsAction(safeQueryString, isAdmin));
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.description ||
                "Product creation failed"
            );
        } finally {
            setLoader(false);
        }
    }

export const deleteProduct = 
    (setLoader, productId, toast, setOpenDeleteModal, isAdmin, queryString) => async (dispatch, getState) => {
    try {
        const safeQueryString = getDashboardProductsQueryString(queryString);
        setLoader(true)
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";

        try {
            await api.delete(`${endpoint}${productId}`);
        } catch (error) {
            if (isAdmin && error?.response?.status === 401) {
                await api.delete(`/seller/products/${productId}`);
            } else {
                throw error;
            }
        }

        dispatch({
            type: "DELETE_DASHBOARD_PRODUCT",
            payload: productId,
        });
        toast.success("Product deleted successfully");
        setOpenDeleteModal(false);
        await dispatch(dashboardProductsAction(safeQueryString, isAdmin));
    } catch (error) {
        const errorMessage =
            error?.response?.data?.message ||
            error?.response?.data?.description ||
            "";

        toast.error(
            errorMessage.toLowerCase().includes("foreign key") ||
            errorMessage.toLowerCase().includes("constraint") ||
            errorMessage.toLowerCase().includes("order")
                ? "Cannot delete product linked to orders"
                : errorMessage || "Some Error Occured"
        )
    } finally {
        setLoader(false);
    }
};

export const updateProductImageFromDashboard = 
    (formData, productId, toast, setLoader, setOpen, isAdmin, queryString) => async (dispatch) => {
    try {
        const safeQueryString = getDashboardProductsQueryString(queryString);
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        const { data } = await api.put(`${endpoint}${productId}/image/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        dispatch({
            type: "UPDATE_DASHBOARD_PRODUCT",
            payload: data,
        });
        toast.success("Image upload successful");
        setOpen(false);
        await dispatch(dashboardProductsAction(safeQueryString, isAdmin));
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error?.response?.data?.description ||
            "Product Image upload failed"
        );
    } finally {
        setLoader(false);
    }
};

export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(getAllCategoriesDashboard());
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };




  export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };
