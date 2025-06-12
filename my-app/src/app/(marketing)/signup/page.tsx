"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation("signup");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert(t("passwordMismatch"));
      return;
    }

    console.log("Sign Up submitted", { username, email, password, confirmPassword });

    // Add your sign-up logic here.
    // After success, you might want to redirect:
    // router.push('/dashboard');
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/R.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-lg px-4 py-8 sm:max-w-xl sm:px-10 sm:py-10 bg-white/90 rounded-2xl shadow-2xl backdrop-blur-md mx-4 z-10">
        <h1 className="text-4xl font-bold text-center text-orange-700 mb-4 tracking-wide">
          RecipeRealm
        </h1>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8 tracking-wide">
          {t("signup.title")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              {t("signup.username")}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("signup.placeholderUsername")}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("signup.email")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("signup.placeholderEmail")}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("signup.placeholderPassword")}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {t("signup.confirmPassword")}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("signup.placeholderConfirmPassword")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
          >
            {t("signup.submit")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t("signup.alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-orange-600 hover:underline">
            {t("signup.login")}
          </Link>
        </p>

       
      </div>
    </div>
  );
}
