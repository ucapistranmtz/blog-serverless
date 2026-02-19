import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-white border-b border-gray-100 shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-700">
        Serverless Blog
      </Link>
      <div className="space-x-4">
        <Link
          href="/login"
          className="text-gray-600 hover:text-blue-700 font-medium"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
