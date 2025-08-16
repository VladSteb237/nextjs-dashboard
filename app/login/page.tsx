import React, { Suspense } from "react";
import AcmeLogo from "../ui/acme-logo";
import LoginForm from "../ui/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="flex items-center justify-center md:h-screen bg-gray-100">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex w-full h-20 items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-36 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
};

export default LoginPage;
