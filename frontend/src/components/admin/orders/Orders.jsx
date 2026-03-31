import React from "react";
import { LuShoppingCart } from "react-icons/lu";
import OrderTable from "./OrderTable";
import { useSelector } from "react-redux";
import useOrderFilter from "../../../hooks/useOrderFilter";

const Orders = () => {
  const { adminOrder, pagination } = useSelector((state) => state.order);

  useOrderFilter();

  const emptyOrder = !adminOrder || adminOrder?.length === 0;

  return (
    <div className="pb-6 pt-10">
      {emptyOrder ? (
        <div className="surface-card flex flex-col items-center justify-center py-16 text-gray-600">
          <LuShoppingCart size={52} className="mb-3" />
          <h2 className="text-2xl font-semibold">No Orders Placed Yet</h2>
        </div>
      ) : (
        <OrderTable adminOrder={adminOrder} pagination={pagination} />
      )}
    </div>
  );
};

export default Orders;
