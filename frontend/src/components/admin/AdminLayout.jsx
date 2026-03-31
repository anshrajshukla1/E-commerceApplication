import React, { useState } from "react";
import Sidebar from "../shared/Sidebar";
import { Outlet } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { LuMenu, LuX } from "react-icons/lu";

const AdminLayout = () => {
  let [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Dialog
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="relative z-50 xl:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-64 max-w-full flex-col">
            <TransitionChild>
              <div className="absolute left-full top-4 flex w-16 justify-center">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-white"
                >
                  <LuX className="text-2xl" />
                </button>
              </div>
            </TransitionChild>

            <Sidebar />
          </DialogPanel>
        </div>
      </Dialog>

      <div className="hidden xl:block xl:w-64 xl:shrink-0">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between gap-x-4 border-b border-white/70 bg-white/80 px-6 shadow-sm backdrop-blur-xl xl:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-gray-700"
          >
            <LuMenu className="text-2xl" />
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Dashboard
          </span>
        </div>

        <main className="flex-1">
          <div className="flex flex-col gap-6 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
