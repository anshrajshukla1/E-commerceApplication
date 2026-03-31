import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getOrdersForDashboard } from "../store/actions";

const useOrderFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

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

    const queryString = params.toString();

    if (!queryString || queryString === "undefined") {
      return;
    }

    dispatch(getOrdersForDashboard(queryString, isAdmin));
  }, [dispatch, isAdmin, searchParams, user]);
};

export default useOrderFilter;
