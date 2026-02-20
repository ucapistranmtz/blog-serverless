import Link from "next/link";
import Navbar from "./components/layout/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            The <span className="text-blue-700">Serverless</span> Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This blog is my journey to fullstack engineer, exploring Terraform,
            AWS Cloud,Node,Dynamodb,NextJs, 100% Serverless well not for the
            CI/CD that is runnig at my Orange Pi 5 plus
          </p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest Stories</h2>
            <Link href="/posts" className="text-blue-700 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((post) => (
              <article
                key={post}
                className="group border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
              >
                {/* Contenedor de imagen con aspect ratio fijo */}
                <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4 bg-gray-50">
                  <Image
                    src="/board.png" // Asegúrate de que la extensión sea .jpg como el archivo que subiste
                    alt="Orange Pi 5 Plus Engineering Lab"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors">
                  Coming soon: My engineering stories
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  How I ditched external databases for a Single Table Design in
                  DynamoDB...
                </p>

                <div className="flex items-center text-xs font-bold text-blue-700 tracking-wide">
                  READ MORE{" "}
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
