import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const loginHandler = (data) => {
    dispatch(
      authenticateSignInUser(data, toast, reset, navigate, setLoader)
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(loginHandler)}
        className="sm:w-[450px] w-[360px] shadow-lg py-8 sm:px-8 px-4 rounded-md"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <AiOutlineLogin className="text-slate-800 text-5xl" />
          <h1 className="text-slate-800 text-center lg:text-3xl text-2xl font-bold">
            Login Here
          </h1>
        </div>

        <hr className="mt-2 mb-5 border-slate-300" />

        {/* INPUTS */}
        <div className="flex flex-col gap-3">
          <InputField
            label="UserName"
            required
            id="username"
            type="text"
            message="*UserName is required"
            placeholder="Enter your username"
            register={register}
            errors={errors}
          />

          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Enter your password"
            register={register}
            errors={errors}
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loader}
          className="bg-blue-500 flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:bg-blue-600 transition duration-200 rounded-md my-3"
          type="submit"
        >
          {loader ? (
            <>
              <Spinners /> Loading...
            </>
          ) : (
            <>Login</>
          )}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-700 mt-6">
          Don't have an account?
          <Link
            className="font-semibold underline hover:text-black ml-1"
            to="/register"
          >
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LogIn;