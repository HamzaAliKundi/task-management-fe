import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../common/input";
import InputValidationError from "../../common/inputValidationError";
import Button from "../../common/button";
import { useLoginMutation } from "../../apis/auth";
import { Link, useNavigate } from "react-router-dom";
import { ILoginForm } from "../../types/auth";
import logo from "/logo.svg";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [invalidCredientals, setInvalidCredientals] = useState("");

  const navigate = useNavigate();

  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const togglePasswordVisibility = () =>
    setPasswordVisible((prevState) => !prevState);

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    login(data, {
      onSuccess: (res) => {
        localStorage.setItem("token", res?.token);
        navigate("/dashboard");
      },
      onError: (err: any) => {
        setInvalidCredientals(err?.response?.data.message);
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full mx-2 lg:mx-0 max-w-lg bg-white rounded-lg shadow-sm py-10 px-4 lg:py-16 lg:px-12">
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="h-24 w-auto"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <Input<ILoginForm>
              name="email"
              label="Email Address"
              type="email"
              autoFocus={true}
              placeholder="Enter your email"
              register={register}
              validation={{ required: "Email is required." }}
            />
            <InputValidationError message={errors.email?.message} />
          </div>

          <div className="mb-4 relative">
            <div className="relative">
              <Input<ILoginForm>
                name="password"
                label="Password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                register={register}
                validation={{ required: "Password is required." }}
                className="pr-10"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-10 transform -translate-y-1/2 cursor-pointer"
              >
                {passwordVisible ? (
                  <AiFillEyeInvisible className="text-gray-500" size={20} />
                ) : (
                  <AiFillEye className="text-gray-500" size={20} />
                )}
              </span>
            </div>
            {invalidCredientals ? (
              <span className="text-red-500 font-medium mt-1 ml-1">
                {invalidCredientals}
              </span>
            ) : null}
            <InputValidationError message={errors.password?.message} />
          </div>

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="w-4 h-4"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-gray-700 text-sm"
              >
                Remember me
              </label>
            </div>
            <Link
              to="#"
              className="text-sm text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Forgot password?
            </Link>
          </div>

          <div className="w-full">
            <Button type="submit" className="w-full" isLoading={isPending}>
              Log In
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
