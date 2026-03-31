import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellersDashboard } from "../../../store/actions";

const useSellerFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();

    if (!user || !token) {
      return;
    }

    const params = new URLSearchParams();
    const currentPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    params.set("pageNumber", currentPage - 1);
    dispatch(getAllSellersDashboard(params.toString()));
  }, [dispatch, searchParams, user]);
};

export default useSellerFilter;
