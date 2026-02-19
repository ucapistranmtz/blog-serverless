"use client";

import React, { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Cognito client initialized outside to avoid re-renders
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

interface ActionState {
  error: string | null;
  success: boolean;
  email?: string;
}

export default function SignUpPage() {
  const router = useRouter();

  /**
   * Client-side "Action" compatible with useActionState
   * Handles Cognito Sign-Up without a server-side runtime
   */
  const handleSignUp = async (
    prevState: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const command = new SignUpCommand({
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
      });

      await client.send(command);
      return { error: null, success: true, email };
    } catch (err: unknown) {
      // Safe error handling following TypeScript best practices (no any)
      if (err instanceof Error) {
        return { error: err.message, success: false };
      }
      return { error: "An unexpected error occurred", success: false };
    }
  };

  // useActionState is now available in React 19 for client-side functions too!
  const [state, formAction, isPending] = useActionState(handleSignUp, {
    error: null,
    success: false,
  });

  if (state.success) {
    router.push("/verify?email=" + encodeURIComponent(state.email || ""));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white mb-6 p-6 rounded-xl shadow-sm w-full max-w-sm text-center border border-gray-100 text-black">
        <h1 className="text-xl font-bold">Create new account</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-gray-100">
        <form action={formAction} className="flex flex-col w-full">
          <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
            NAME
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full mb-4 p-3 border border-gray-200 rounded-lg text-black bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            placeholder="hello@example.com"
            required
            className="w-full mb-4 p-3 border border-gray-200 rounded-lg text-black bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
            PASSWORD
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full mb-6 p-3 border border-gray-200 rounded-lg text-black bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50 transition-all active:scale-95"
          >
            {isPending ? "Connecting to Cognito..." : "Sign Up"}
          </button>

          {state.error && (
            <p className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
