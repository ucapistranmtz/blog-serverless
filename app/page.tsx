import Link from "next/link";
import Navbar from "./components/layout/NavBar";

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
            CI/CD with my Orange Pi 5 plus
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
            {/* We will map our DynamoDB posts here later*/}
            {[1, 2, 3].map((post) => (
              <article
                key={post}
                className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-100 rounded-xl mb-4"></div>
                <h3 className="text-xl font-bold mb-2">
                  Coming soon: My AWS Serverless Stories
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  How I ditched external databases for a Single Table Design in
                  DynamoDB...
                </p>
                <div className="flex items-center text-xs font-semibold text-blue-700">
                  READ MORE →
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
