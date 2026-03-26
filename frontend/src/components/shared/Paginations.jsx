import { Pagination } from "@mui/material";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const Paginations = ({ numberOfPage, totalProducts }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(searchParams);

  const paramValue = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const onChangeHandler = (event, value) => {
    params.set("page", value.toString());
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Pagination
        count={numberOfPage || 1}
        page={paramValue}
        defaultPage={1}
        boundaryCount={2}
        siblingCount={0}
        shape="rounded"
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Paginations;