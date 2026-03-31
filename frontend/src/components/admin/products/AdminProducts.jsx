import React, { useEffect, useState } from "react";
import { LuPackagePlus, LuPackageSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../shared/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { adminProductTableColumn } from "../../helper/tableColumn";
import { useDashboardProductFilter } from "../../../hooks/useProductFilter";
import Modal from "../../shared/Modal";
import AddProductForm from "./AddProductForm";
import DeleteModal from "../../shared/DeleteModal";
import { deleteProduct } from "../../../store/actions";
import toast from "react-hot-toast";
import ImageUploadForm from "./ImageUploadForm";
import ProductViewModal from "../../shared/ProductViewModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const AdminProducts = () => {
  const { products, pagination } = useSelector((state) => state.products);
  const { isLoading } = useSelector((state) => state.errors);
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [openImageUploadModal, setOpenImageUploadModal] = useState(false);

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const queryString = searchParams.toString();
  const pathname = useLocation().pathname;
  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  useDashboardProductFilter();

  useEffect(() => {
    setCurrentPage(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  }, [searchParams]);

  const tableRecords = products?.map((item) => ({
    id: item.productId,
    productName: item.productName,
    description: item.description,
    discount: item.discount,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    specialPrice: item.specialPrice,
  }));

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenUpdateModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenDeleteModal(true);
  };

  const handleImageUpload = (product) => {
    setSelectedProduct(product);
    setOpenImageUploadModal(true);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setOpenProductViewModal(true);
  };

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const onDeleteHandler = () => {
    dispatch(
      deleteProduct(
        setLoader,
        selectedProduct?.id,
        toast,
        setOpenDeleteModal,
        isAdmin,
        queryString
      )
    );
  };

  const emptyProduct = !products || products?.length === 0;

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-copy">
            Manage catalog items, review pricing, upload imagery, and update inventory presentation.
          </p>
        </div>
        <button onClick={() => setOpenAddModal(true)} className="btn-primary">
          <LuPackagePlus className="text-lg" />
          Add Product
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : emptyProduct ? (
        <div className="surface-card flex flex-col items-center justify-center py-16 text-gray-600">
          <LuPackageSearch size={52} className="mb-3" />
          <h2 className="text-2xl font-semibold">No products created yet</h2>
        </div>
      ) : (
        <div className="data-grid-shell">
          <DataGrid
            className="w-full"
            rows={tableRecords || []}
            columns={adminProductTableColumn(
              handleEdit,
              handleDelete,
              handleImageUpload,
              handleProductView
            )}
            paginationMode="server"
            rowCount={pagination?.totalElements || 0}
            paginationModel={{
              pageSize: pagination?.pageSize || 10,
              page: currentPage - 1,
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pageSizeOptions={[pagination?.pageSize || 10]}
            pagination
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
          />
        </div>
      )}

      <Modal
        open={openUpdateModal || openAddModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
        title={openUpdateModal ? "Update Product" : "Add Product"}
      >
        <AddProductForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
          product={selectedProduct}
          update={openUpdateModal}
          queryString={queryString}
        />
      </Modal>

      <Modal
        open={openImageUploadModal}
        setOpen={setOpenImageUploadModal}
        title="Add Product Image"
      >
        <ImageUploadForm
          setOpen={setOpenImageUploadModal}
          product={selectedProduct}
          queryString={queryString}
        />
      </Modal>

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loader={loader}
        title="Delete Product"
        onDeleteHandler={onDeleteHandler}
      />

      <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminProducts;
