"use client";

import React, { useActionState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// AWS Cognito Client Initialization
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

interface VerifyState {
  error: string | null;
  success: boolean;
}

const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // We get the email from the URL (e.g., /verify?email=test@example.com)
  const email = searchParams.get("email") || "";

  /**
   * Action to handle Cognito confirmation.
   * This is passed to useActionState for React 19 form management.
   */
  const handleVerify = async (
    prevState: VerifyState,
    formData: FormData,
  ): Promise<VerifyState> => {
    const code = formData.get("code") as string;

    try {
      const command = new ConfirmSignUpCommand({
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: code,
      });

      await client.send(command);
      return { error: null, success: true };
    } catch (err: unknown) {
      // Correct error handling without using 'any'
      if (err instanceof Error) {
        return { error: err.message, success: false };
      }
      return { error: "An unknown error occurred", success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(handleVerify, {
    error: null,
    success: false,
  });

  // If confirmed, redirect to login
  useEffect(() => {
    if (state.success) {
      router.push("/login?confirmed=true");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col w-full">
      <p className="text-sm text-gray-500 mb-6 text-center">
        Verification Code for: <br />
        <span className="font-semibold text-blue-600">{email}</span>
      </p>

      <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left">
        Code
      </label>
      <input
        type="text"
        name="code"
        placeholder="123456"
        required
        className="w-full mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 
        outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl
        tracking-[0.5em] font-mono text-black"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-all active:scale-95"
      >
        {isPending ? "Confirming..." : "Verify account"}
      </button>

      {state.error && (
        <p className="mt-4 text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">
          {state.error}
        </p>
      )}
    </form>
  );
};

export default VerifyForm;
