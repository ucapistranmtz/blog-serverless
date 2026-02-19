"use client";

import React, { useState } from "react";
import Link from "next/link";
import ForgotPasswordForm from "../../components/auth/ForgotPwdForm";
import ResetPasswordForm from "../../components/auth/ResetPwdForm";

/**
 * Main Page for Password Recovery.
 * Manages the flow between requesting a code and setting a new password.
 */
export default function ForgotPasswordPage() {
  // Step 1: 'request' | Step 2: 'reset'
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState<string>("");

  const handleCodeSent = (userEmail: string) => {
    setEmail(userEmail);
    setStep("reset");
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
        {step === "request" ? "Reset your password" : "Check your email"}
      </h1>

      {step === "request" ? (
        <ForgotPasswordForm onCodeSent={handleCodeSent} />
      ) : (
        <ResetPasswordForm email={email} />
      )}

      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
