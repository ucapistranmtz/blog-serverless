"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

interface ResetState {
  error: string | null;
  success: boolean;
}

interface ResetPasswordFormProps {
  /** The email address provided in the previous step */
  email: string;
}

const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const router = useRouter();

  /**
   * Action to confirm the new password using the verification code
   * sent to the user's email via Cognito.
   */
  const handleResetPassword = async (
    prevState: ResetState,
    formData: FormData,
  ): Promise<ResetState> => {
    const code = formData.get("code") as string;
    const newPassword = formData.get("password") as string;

    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await client.send(command);

      return { error: null, success: true };
    } catch (err: unknown) {
      // Safe error handling without 'any'
      if (err instanceof Error) {
        return { error: err.message, success: false };
      }
      return { error: "An unexpected error occurred", success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(handleResetPassword, {
    error: null,
    success: false,
  });

  // Effect to handle navigation after successful password reset
  useEffect(() => {
    if (state.success) {
      // Redirect to login with a success indicator
      router.push("/login?reset=success");
    }
  }, [state.success, router]);

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter the 6-digit code sent to <br />
        <span className="font-semibold text-blue-600">{email}</span> and your
        new password.
      </p>

      <form action={formAction} className="flex flex-col w-full">
        <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left uppercase">
          Verification Code
        </label>
        <input
          type="text"
          name="code"
          placeholder="123456"
          required
          maxLength={6}
          className="w-full mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 
          outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl
          tracking-[0.5em] font-mono text-black"
        />

        <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left uppercase">
          New Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
          className="w-full mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 
          outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg 
          disabled:opacity-50 transition-all active:scale-95 shadow-md"
        >
          {isPending ? "Updating Password..." : "Reset Password"}
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

export default ResetPasswordForm;
