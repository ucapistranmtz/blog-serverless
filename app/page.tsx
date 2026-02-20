import Navbar from "./components/layout/NavBar";
import { PostGrid } from "./components/sections/PostGrid";
import { Hero } from "./components/sections/Hero";
import { Footer } from "./components/sections/Footer";
import { TechStack } from "./components/sections/TechStack";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <TechStack></TechStack>
        <Hero></Hero>
        <PostGrid></PostGrid>
      </main>
      <Footer></Footer>
    </div>
  );
}
