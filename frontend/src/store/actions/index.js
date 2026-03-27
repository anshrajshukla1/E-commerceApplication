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
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/products?${queryString}`);
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
    dispatch({ type: "IS_SUCCESS" });
  } catch {
    dispatch({ type: "IS_ERROR", payload: "Failed to fetch categories" });
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

      localStorage.removeItem("auth");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("CHECKOUT_ADDRESS");
      dispatch({ type: "LOG_OUT" });

      localStorage.setItem("auth", JSON.stringify(data));
      console.log("USER:", data);

      dispatch({ type: "LOGIN_USER", payload: data });
      await Promise.all([dispatch(getUserCart()), dispatch(getUserAddresses())]);

      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => (dispatch) => {
  localStorage.removeItem("auth");
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
    const products = data?.products || [];
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
            console.log(error);
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
