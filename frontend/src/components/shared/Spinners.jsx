import { RotatingLines } from "react-loader-spinner";

const Spinners = () => {
  return (
    <RotatingLines
      visible={true}
      height="20"
      width="20"
      color="white"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="loading"
    />
  );
};

export default Spinners;