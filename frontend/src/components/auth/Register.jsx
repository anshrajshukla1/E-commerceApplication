import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LuBadgeCheck, LuUserPlus } from "react-icons/lu";
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

  const registerHandler = (data) => {
    const payload = {
      userName: data.username,
      email: data.email,
      password: data.password,
      role: ["user"],
    };

    dispatch(registerNewUser(payload, toast, reset, navigate, setLoader));
  };

  return (
    <div className="page-section flex min-h-[calc(100vh-76px)] items-center justify-center py-14">
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="surface-card w-full max-w-[460px] bg-white px-5 py-10 sm:px-8"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
            <LuUserPlus className="text-4xl" />
          </span>
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
            Register Here
          </h1>
          <p className="text-center text-sm text-slate-500">
            Create your account and start shopping with a cleaner checkout flow.
          </p>
        </div>

        <hr className="soft-divider mt-6 mb-6" />

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

        <button
          disabled={loader}
          className="btn-primary mt-4 flex w-full justify-center"
          type="submit"
        >
          {loader ? (
            <>
              <Spinners /> Loading...
            </>
          ) : (
            <>
              <LuBadgeCheck />
              Register
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?
          <Link
            className="ml-1 font-semibold underline hover:text-black"
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
