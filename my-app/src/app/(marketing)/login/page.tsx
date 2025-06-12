"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("login");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Login submitted", { username, password });

    // TODO: Replace with actual username login logic (API call, etc.)
    // On success:
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/images/Y.jpg')] bg-cover bg-center blur  bg-gray-80"
      ></div>
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="w-full max-w-lg px-4 py-8 sm:max-w-xl sm:px-10 sm:py-10 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md mx-4 z-10">
        <h1 className="text-4xl font-bold text-center text-orange-700 mb-8 tracking-wide">
          RecipeRealm
        </h1>

        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          {t("login.title")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t("login.username")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              placeholder={t("login.placeholderUsername")}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("login.password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              placeholder={t("login.placeholderPassword")}
            />
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
            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition"
          >
            {t("login.submit")}
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

