import React from "react";
import { LuPanelLeftOpen } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { adminNavigation, sellerNavigation } from "../../utils";
import classNames from "classnames";

const Sidebar = () => {
  const pathName = useLocation().pathname;
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  const sideBarLayout = isAdmin ? adminNavigation : sellerNavigation;

  return (
    <div className="flex h-full min-h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-900 bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
          <LuPanelLeftOpen className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-white">
            {isAdmin ? "Admin Panel" : "Seller Panel"}
          </h1>
          <p className="text-sm text-slate-400">Operations workspace</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-3">
          <li>
            <ul role="list" className="space-y-2">
              {sideBarLayout.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      pathName === item.href
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "cursor-pointer bg-gradient-to-r from-blue-600/85 to-indigo-600/85 text-white shadow-md hover:from-blue-600 hover:to-indigo-600 hover:text-white",
                      "group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-semibold leading-6 transition-all duration-200"
                    )}
                  >
                    <item.icon className="text-xl" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
