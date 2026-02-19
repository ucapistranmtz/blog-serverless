import { Suspense } from "react";
import VerifyForm from "../../components/auth/VerifyForm";

export default function VerifyPage() {
  return (
    /* El main con min-h-screen y flex centra el contenido en toda la pantalla */
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      {/* Esta es la tarjeta blanca con ancho máximo limitado */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Verify your account
        </h1>

        <Suspense
          fallback={<div className="text-center text-black">Loading...</div>}
        >
          <VerifyForm />
        </Suspense>
      </div>
    </main>
  );
}
