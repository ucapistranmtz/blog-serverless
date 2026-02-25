// app/page.tsx
import { PostGrid } from "./components/sections/PostGrid";
import { Hero } from "./components/sections/Hero";
import { TechStack } from "./components/sections/TechStack";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <title>My serverless blog </title>
      <Hero />
      <TechStack />
      <PostGrid />
    </main>
  );
}
