"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { login, resetError } from "@/store/UserSlice";
import { RootState, AppDispatch } from "@/store/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { t } = useTranslation("login");

  // Clear error when user starts typing
  const clearError = () => {
    if (error) {
      dispatch(resetError());
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      dispatch(resetError());
      router.push("/Home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/Y.jpg')] bg-cover bg-center blur bg-gray-80"></div>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="w-full max-w-lg px-4 py-8 sm:max-w-xl sm:px-10 sm:py-10 bg-white rounded-2xl shadow-2xl backdrop-blur-md mx-4 z-10">
        <h1 className="text-4xl font-bold text-center text-orange-700 mb-8 tracking-wide">
          RecipeRealm
        </h1>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          {t("login.title")}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error === "Incorrect password" ? t("login.error.incorrectPassword") : error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("login.email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                clearError();
                setEmail(e.target.value);
              }}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("login.placeholderEmail")}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("login.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  clearError();
                  setPassword(e.target.value);
                }}
                required
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                placeholder={t("login.placeholderPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-orange-600" />
              <span>{t("login.rememberMe")}</span>
            </label>
            <Link href="/forgot-password" className="text-orange-600 hover:underline">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {t("login.noAccount")}{" "}
          <Link href="/signup" className="text-orange-600 hover:underline">
            {t("login.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}