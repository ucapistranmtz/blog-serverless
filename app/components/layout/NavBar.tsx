"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isAdmin = user?.groups.includes("admins");

  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-700">
        Serverless Blog
      </Link>

      <div className="flex items-center space-x-4">
        {isLoading ? (
          // Opcional: Un pequeño espacio reservado o spinner mientras carga el token
          <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
        ) : isAuthenticated ? (
          <>
            <span className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-bold text-black">
                {user?.email?.split("@")[0]}
              </span>
            </span>

            {isAdmin ? (
              <Link
                href="/admin/new-post"
                className="text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Make a post
              </Link>
            ) : (
              ""
            )}
            {/* Botón para ir a crear post */}

            <button
              onClick={logout}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-700 font-medium text-sm"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
