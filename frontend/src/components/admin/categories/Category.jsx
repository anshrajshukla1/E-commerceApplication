import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { LuFolderOpen, LuLayers2 } from "react-icons/lu";
import toast from "react-hot-toast";

import Modal from "../../shared/Modal";
import AddCategoryForm from "./AddCategoryForm";
import Loader from "../../shared/Loader";
import { DeleteModal } from "../../../components/shared/DeleteModal";
import useCategoryFilter from "../../../hooks/useCategoryFilter";
import ErrorPage from "../../shared/ErrorPage";
import { deleteCategoryDashboardAction } from "../../../store/actions";
import { categoryTableColumns } from "../../helper/tableColumn";

const Category = () => {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
  const { categories, pagination } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber + 1 || 1);

  useCategoryFilter();

  const tableRecords = categories?.map((item) => ({
    id: item.categoryId,
    categoryName: item.categoryName,
    version: item.version,
  }));

  const handleEdit = (category) => {
    setOpenUpdateModal(true);
    setSelectedCategory(category);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };

  const onDeleteHandler = () => {
    dispatch(
      deleteCategoryDashboardAction(setOpenDeleteModal, selectedCategory?.id, toast)
    );
  };

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const emptyCategories = !categories || categories?.length === 0;

  if (errorMessage) return <ErrorPage message={errorMessage} />;

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-copy">
            Organize your catalog with better hierarchy and cleaner management tools.
          </p>
        </div>
        <button onClick={() => setOpenModal(true)} className="btn-primary">
          <LuLayers2 className="text-lg" />
          Add Category
        </button>
      </div>

      {categoryLoader ? (
        <Loader />
      ) : emptyCategories ? (
        <div className="surface-card flex flex-col items-center justify-center py-16 text-gray-600">
          <LuFolderOpen size={52} className="mb-3" />
          <h2 className="text-2xl font-semibold">No Categories Created Yet</h2>
        </div>
      ) : (
        <div className="data-grid-shell">
          <DataGrid
            className="w-full"
            rows={tableRecords}
            columns={categoryTableColumns(handleEdit, handleDelete)}
            paginationMode="server"
            rowCount={pagination?.totalElements || 0}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
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
        open={openUpdateModal || openModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
        title={openUpdateModal ? "Update Category" : "Add Category"}
      >
        <AddCategoryForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenModal}
          open={categoryLoader}
          category={selectedCategory}
          update={openUpdateModal}
        />
      </Modal>

      <DeleteModal
        open={openDeleteModal}
        loader={categoryLoader}
        setOpen={setOpenDeleteModal}
        title="Are you want to delete this category"
        onDeleteHandler={onDeleteHandler}
      />
    </div>
  );
};

export default Category;
