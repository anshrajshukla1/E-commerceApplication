import React from "react";
import { LuCreditCard, LuMapPinned, LuPackageCheck } from "react-icons/lu";
import { formatPriceCalculation } from "../../utils/formatPrice";

const OrderSummary = ({ totalPrice, cart, address, paymentMethod }) => {
  const orderItems = Array.isArray(cart) ? cart : [];
  const orderTotal = Number(totalPrice) || 0;

  if (orderItems.length === 0) {
    return <p className="mt-10 text-center">No items in cart</p>;
  }

  return (
    <div className="page-section mb-8 px-0">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <LuMapPinned className="text-xl text-indigo-600" />
              <h2 className="text-2xl font-semibold">Billing Address</h2>
            </div>

            {address ? (
              <div className="grid gap-2 text-slate-600 sm:grid-cols-2">
                <p><strong>Building Name:</strong> {address.buildingName}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>Street:</strong> {address.street}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Pincode:</strong> {address.pincode}</p>
                <p><strong>Country:</strong> {address.country}</p>
              </div>
            ) : (
              <p className="text-red-500">No address selected</p>
            )}
          </div>

          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <LuCreditCard className="text-xl text-indigo-600" />
              <h2 className="text-2xl font-semibold">Payment Method</h2>
            </div>
            <p className="text-slate-600">
              <strong>Method:</strong> {paymentMethod || "Not selected"}
            </p>
          </div>

          <div className="surface-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <LuPackageCheck className="text-xl text-indigo-600" />
              <h2 className="text-2xl font-semibold">Order Items</h2>
            </div>

            <div className="space-y-3">
              {orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <img
                    src={`${import.meta.env.VITE_BACK_END_URL}/images/${item.image}`}
                    alt="Product"
                    className="h-16 w-16 rounded-2xl object-cover"
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />

                  <div className="text-slate-500">
                    <p className="font-semibold text-slate-800">{item.productName}</p>
                    <p>
                      {item.quantity} x ${item.specialPrice} = $
                      {formatPriceCalculation(item.quantity, item.specialPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="surface-card sticky top-28 space-y-4 p-6">
            <h2 className="text-2xl font-semibold">Order Summary</h2>

            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between">
                <span>Products</span>
                <span>${formatPriceCalculation(orderTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>

              <div className="soft-divider flex justify-between border-t pt-3 font-semibold text-slate-900">
                <span>SubTotal</span>
                <span>${formatPriceCalculation(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
