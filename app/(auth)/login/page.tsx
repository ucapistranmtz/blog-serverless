import { Suspense } from "react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      {/* Esta es la tarjeta blanca con ancho máximo limitado */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        <Suspense
          fallback={<div className="text-center text-black">Loading...</div>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
};

export default LoginPage;
