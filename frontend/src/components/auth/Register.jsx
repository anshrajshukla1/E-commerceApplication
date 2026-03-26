import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const Register = () => {
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

  // 🔥 FIXED PAYLOAD HERE
  const registerHandler = (data) => {
    const payload = {
      userName: data.username,   // ✅ matches backend
      email: data.email,
      password: data.password,
      role: ["user"],            // ✅ matches backend (Set<String>)
    };

    dispatch(registerNewUser(payload, toast, reset, navigate, setLoader));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="sm:w-[450px] w-[360px] shadow-lg py-8 sm:px-8 px-4 rounded-xl bg-white"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <FaUserPlus className="text-slate-800 text-5xl" />
          <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
            Register Here
          </h1>
        </div>

        <hr className="mt-2 mb-5 text-gray-300" />

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
            label="Email"
            required
            id="email"
            type="email"
            message="*Email is required"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />

          <InputField
            label="Password"
            required
            id="password"
            min={6}
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
          className="w-full py-2 mt-3 rounded-md font-semibold text-white 
          bg-gradient-to-r from-purple-600 to-red-500 
          hover:from-purple-500 hover:to-red-400 
          transition duration-300 flex justify-center items-center gap-2"
          type="submit"
        >
          {loader ? (
            <>
              <Spinners /> Loading...
            </>
          ) : (
            <>Register</>
          )}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?
          <Link
            className="font-semibold underline hover:text-black ml-1"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;