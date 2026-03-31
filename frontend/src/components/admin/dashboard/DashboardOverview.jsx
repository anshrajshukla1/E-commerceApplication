import React from "react";
import { formatRevenue } from "../../../utils/formatPrice";

const DashboardOverview = ({ title, amount, icon, revenue = false }) => {
  const convertedAmount = revenue ? Number(amount).toFixed(2) : amount;

  return (
    <div className="dashboard-stat w-full px-6 py-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {revenue ? "$" : null}
            {revenue ? formatRevenue(convertedAmount) : convertedAmount}
          </h1>
        </div>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          {React.createElement(icon, { className: "text-2xl" })}
        </span>
      </div>
      <p className="text-sm text-slate-500">Live platform snapshot</p>
    </div>
  );
};

export default DashboardOverview;
