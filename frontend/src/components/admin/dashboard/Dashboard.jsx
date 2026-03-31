import React, { useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import { LuBoxes, LuChartNoAxesCombined, LuShoppingCart } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { analyticsAction } from "../../../store/actions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { user } = useSelector((state) => state.auth);
  const {
    analytics: { productCount, totalRevenue, totalOrders },
  } = useSelector((state) => state.admin);

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();

    if (user && token) {
      dispatch(analyticsAction());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <Loader />;
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-copy">
            A clean snapshot of products, revenue, and order activity across the platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardOverview title="Total Products" amount={productCount} icon={LuBoxes} />
        <DashboardOverview title="Total Orders" amount={totalOrders} icon={LuShoppingCart} />
        <DashboardOverview
          title="Total Revenue"
          amount={totalRevenue}
          icon={LuChartNoAxesCombined}
          revenue
        />
      </div>
    </div>
  );
};

export default Dashboard;
