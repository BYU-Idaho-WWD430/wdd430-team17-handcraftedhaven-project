"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { register, RegisterResult } from "@/app/lib/actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

export default function RegisterForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [result, formAction, isPending] = useActionState<
    RegisterResult | undefined,
    FormData
  >(register, undefined);

  useEffect(() => {
    if (result?.success) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [result, router]);

  return (
    <>
      {result?.success && (
        <p className="mt-4 text-green-600 text-sm border border-green-400 rounded p-2 bg-green-50">
          Profile created successfully! Redirecting to login...
        </p>
      )}
      {result?.message && !result.success && (
        <p className="mt-4 text-red-600 text-sm border border-red-400 rounded p-2 bg-red-50">
          {result.message}
        </p>
      )}

      <form className="space-y-3" action={formAction}>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl font-bold text-center">Register</h1>
          <div className="w-full space-y-4">
            <div>
              <label
                className="block text-xs font-medium text-gray-900"
                htmlFor="firstname"
              >
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                id="firstname"
                name="firstname"
                type="text"
                defaultValue={result?.submittedData?.firstname}
                required
              />
              {result?.errors?.firstname?._errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 mt-1">
                  {err}
                </p>
              ))}
            </div>
            <div>
              <label
                className="block text-xs font-medium text-gray-900"
                htmlFor="lastname"
              >
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                id="lastname"
                name="lastname"
                type="text"
                defaultValue={result?.submittedData?.lastname}
                required
              />
              {result?.errors?.lastname?._errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 mt-1">
                  {err}
                </p>
              ))}
            </div>
            <div>
              <label
                className="block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                id="email"
                name="email"
                type="email"
                defaultValue={result?.submittedData?.email}
                required
              />
              {result?.errors?.email?._errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 mt-1">
                  {err}
                </p>
              ))}
            </div>
            <div>
              <label
                className="block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-md border border-gray-200 py-[9px] pl-3 pr-10 text-sm"
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  minLength={8}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                  title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-700" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>
              <div>
                <label
                  className="block text-xs font-medium text-gray-900"
                  htmlFor="confirmPassword"
                >
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    minLength={8}
                  />
                </div>
                {result?.errors?.confirmPassword?._errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-600 mt-1">
                    {err}
                  </p>
                ))}
              </div>
              {result?.errors?.password?._errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 mt-1">
                  {err}
                </p>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-2">
                User Type <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-4 mb-5">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="user_type"
                    value="user"
                    required
                    className="accent-black"
                    defaultChecked
                  />
                  User
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="user_type"
                    value="seller"
                    className="accent-black"
                  />
                  Seller
                </label>
              </div>
            </div>
          </div>

          <button
            className="mt-4 w-full bg-black text-white rounded-2xl py-2 cursor-pointer border-2 border-black hover:bg-white hover:text-black transition duration-1000"
            aria-disabled={isPending}
            disabled={isPending || result?.success}
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </>
  );
}
