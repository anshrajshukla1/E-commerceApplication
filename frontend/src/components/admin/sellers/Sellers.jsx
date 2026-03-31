import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LuUserRoundPlus, LuUsers } from "react-icons/lu";

import SellerTable from "./SellerTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import AddSellerForm from "./AddSellerForm";
import useSellerFilter from "./useSellerFilter";

const Sellers = () => {
  const [openModal, setOpenModal] = useState(false);
  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useSellerFilter();

  const emptySellers = !sellers || sellers?.length === 0;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sellers</h1>
          <p className="admin-page-copy">
            Add and review seller accounts in a cleaner workspace.
          </p>
        </div>
        <button onClick={() => setOpenModal(true)} className="btn-primary">
          <LuUserRoundPlus className="text-lg" />
          Add Seller
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : emptySellers ? (
        <div className="surface-card flex flex-col items-center justify-center py-16 text-gray-600">
          <LuUsers size={52} className="mb-3" />
          <h2 className="text-2xl font-semibold">No Seller Created Yet</h2>
        </div>
      ) : (
        <SellerTable sellers={sellers} pagination={pagination} />
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Modal>
    </React.Fragment>
  );
};

export default Sellers;
