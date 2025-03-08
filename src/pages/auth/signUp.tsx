import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../common/input";
import InputValidationError from "../../common/inputValidationError";
import Button from "../../common/button";
import { useSignUpMutation } from "../../apis/auth";
import { Link, useNavigate } from "react-router-dom";
import { ISignUpForm } from "../../types/auth";
import logo from "/logo.svg";

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const { mutate: signUp, isPending } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>();

  const togglePasswordVisibility = () =>
    setPasswordVisible((prevState) => !prevState);

  const onSubmit: SubmitHandler<ISignUpForm> = (data) => {
    signUp(data, {
      onSuccess: (res) => {
        console.log(res)
        localStorage.setItem("token", res?.token);
        navigate("/dashboard");
      },
      onError: (err: any) => {
        if (err?.response?.data.message === "Email is already registered") {
          setEmailError(err.response.data.message);
        }
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
            <Input<ISignUpForm>
              name="name"
              label="Full Name"
              type="text"
              autoFocus={true}
              placeholder="Enter your full name"
              register={register}
              validation={{ required: "Full name is required." }}
            />
            <InputValidationError message={errors.name?.message} />
          </div>

          <div className="mb-6">
            <Input<ISignUpForm>
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              register={register}
              validation={{ 
                required: "Email is required.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
            />
            {emailError ? (
              <span className="text-red-500 font-medium mt-1 ml-1">
                {emailError}
              </span>
            ) : null}
            <InputValidationError message={errors.email?.message} />
          </div>

          <div className="mb-4 relative">
            <div className="relative">
              <Input<ISignUpForm>
                name="password"
                label="Password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                register={register}
                validation={{ 
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                }}
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
            <InputValidationError message={errors.password?.message} />
          </div>

          <div className="flex flex-col mb-10">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                {...register("acceptTerms", { required: "Please accept our terms and conditions to continue" })}
                className="w-4 h-4"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-gray-700 text-sm"
              >
                I agree to the <Link to="#" className="text-blue-500 hover:underline">Terms and Conditions</Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <span className="text-red-500 text-sm mt-1 ml-1">
                {errors.acceptTerms.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <Button type="submit" className="w-full" isLoading={isPending}>
              Sign Up
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/"
            className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;