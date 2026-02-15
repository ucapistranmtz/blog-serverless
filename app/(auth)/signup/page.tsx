"use client";

import { useActionState } from "react";
import { authClient } from "@/lib/auth-client";

type SignUpEmailOptions = Parameters<typeof authClient.signUp.email>[0];

interface FormState {
  error?: string;
  success?: boolean;
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<
    FormState | null,
    FormData
  >(async (prevState, formData) => {
    try {
      const signUpData: SignUpEmailOptions = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackURL: "/dashboard",
      };

      const { error } = await authClient.signUp.email(signUpData);
      if (error) return { error: error.message };
      return { success: true };
    } catch (error) {
      console.error("Critical Auth Error", error);
      return {
        error: "service temporarily unavailable. Our minions are working on it",
      };
    }
  }, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Tarjeta del Título */}
      <div className="bg-white mb-6 p-6 rounded-xl shadow-sm w-full max-w-sm text-center border border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Create new account</h1>
      </div>

      {/* Tarjeta del Formulario */}
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
            className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-gray-50"
          />

          <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            placeholder="hello@example.com"
            required
            className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-gray-50"
          />

          <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
            PASSWORD
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full mb-6 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black bg-gray-50"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 disabled:opacity-50 transition-all active:scale-95"
          >
            {isPending ? "Processing..." : "Sign Up"}
          </button>

          {state?.error && (
            <p className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 text-center animate-pulse">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
