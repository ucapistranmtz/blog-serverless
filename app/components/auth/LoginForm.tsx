"use client";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { useAuth } from "@/app/context/AuthContext";
import { group } from "console";
import { UserSchema } from "@/app/types/auth.schema";

// Initializing the Cognito Client
const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

interface LoginState {
  error: string | null;
  success: boolean;
}

const LoginForm = () => {
  const { login } = useAuth(); // Importa el hook
  const router = useRouter();

  /**
   * Handles the authentication flow using Cognito's USER_PASSWORD_AUTH.
   */
  const handleLogin = async (
    prevState: LoginState,
    formData: FormData,
  ): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);
      const { AuthenticationResult } = response;

      // If the authentication is successful, we get the tokens
      if (AuthenticationResult) {
        const idToken = AuthenticationResult.IdToken;
        if (idToken) {
          // 1. Decodificar el JWT (Payload)
          const base64Url = idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = JSON.parse(window.atob(base64));

          // 2. Mapear y Validar con Zod [cite: 2026-02-23]
          // Cognito usa "cognito:groups", nosotros en UserSchema usamos "groups"
          const userData = UserSchema.parse({
            email: jsonPayload.email,
            groups: jsonPayload["cognito:groups"] || [],
          });

          // 3. Guardar en tu Contexto
          login(idToken, userData);

          router.push("/");
          return { error: null, success: true };
        }
      }

      return { error: "Unexpected response from auth service", success: false };
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Specifically handling the case where the user exists but isn't verified yet
        if (err.name === "UserNotConfirmedException") {
          router.push(`/verify?email=${encodeURIComponent(email)}`);
          return {
            error: "User not confirmed. Redirecting to verification...",
            success: false,
          };
        }
        return { error: err.message, success: false };
      }
      return { error: "An unknown error occurred", success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(handleLogin, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="flex flex-col w-full">
      <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left">
        EMAIL
      </label>
      <input
        type="email"
        name="email"
        placeholder="hello@example.com"
        required
        className="w-full mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 
        outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />

      <label className="text-xs font-semibold text-gray-500 mb-1 ml-1 text-left">
        PASSWORD
      </label>
      <input
        type="password"
        name="password"
        placeholder="••••••••"
        required
        className="w-full mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 
        outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <div className="flex justify-end mt-2 mb-6">
        <button
          type="button"
          onClick={() => router.push("/forgot-pwd")}
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors"
        >
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg 
        disabled:opacity-50 transition-all active:scale-95"
      >
        {isPending ? "Logging in..." : "Sign In"}
      </button>

      {state.error && (
        <p className="mt-4 text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100 font-medium">
          {state.error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
