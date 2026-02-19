"use client";

import React, { useActionState } from "react";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

interface ForgotPasswordState {
  error: string | null;
  success: boolean;
  email: string;
}

interface ForgotPasswordFormProps {
  /**
   * Callback to notify the parent component that the code was sent successfully.
   * This helps to toggle the view to the 'ResetPassword' step.
   */
  onCodeSent: (email: string) => void;
}

const ForgotPwdForm = ({ onCodeSent }: ForgotPasswordFormProps) => {
  /**
   * Action to handle the ForgotPassword request via Cognito.
   * It sends a verification code to the user's registered email.
   */
  const handleForgotPassword = async (
    prevState: ForgotPasswordState,
    formData: FormData,
  ): Promise<ForgotPasswordState> => {
    const email = formData.get("email") as string;

    try {
      const command = new ForgotPasswordCommand({
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
        Username: email,
      });

      await client.send(command);

      // Notify parent to switch to Reset Password form
      onCodeSent(email);

      return { error: null, success: true, email };
    } catch (err: unknown) {
      // Handling errors without 'any' using type guards
      if (err instanceof Error) {
        return { error: err.message, success: false, email: "" };
      }
      return {
        error: "An unexpected error occurred",
        success: false,
        email: "",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleForgotPassword, {
    error: null,
    success: false,
    email: "",
  });

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter your email address and we&apos;ll send you a code to reset your
        password.
      </p>

      <form action={formAction} className="flex flex-col w-full">
        <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left uppercase">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="your-email@example.com"
          required
          className="w-full mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 
          outline-none focus:ring-2 focus:ring-blue-500 text-black shadow-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg 
          disabled:opacity-50 transition-all active:scale-95 shadow-md"
        >
          {isPending ? "Sending Code..." : "Send Reset Code"}
        </button>

        {state.error && (
          <p className="mt-4 text-xs text-red-500 text-center bg-red-50 p-3 rounded border border-red-100 font-medium">
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPwdForm;
