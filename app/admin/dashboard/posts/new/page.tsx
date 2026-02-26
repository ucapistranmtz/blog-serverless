"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext"; // Tu contexto de rol
import { useRouter } from "next/navigation";
import PostEditor from "@/app/components/post/PostEditor";
import { CreatePostSchema } from "@/app/types/createPost.schema";

export default function NewPostPage() {
  const { user } = useAuth();
  const isAdmin = user?.groups.includes("admins");
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: `
  <h1>Building a Modern Serverless Blog in 2026</h1>
  <p>This is a comprehensive test post to verify that our <strong>Tiptap v3</strong> editor extensions are rendering correctly within our Next.js environment.</p>
  
  <blockquote>
    "Serverless architecture allows us to focus on writing code that provides value, rather than managing the servers that run it."
  </blockquote>

  <h2>1. Multimedia & Embeds</h2>
  <p>First, let's verify our local image rendering using the public directory:</p>
  <img src="/board.png" alt="Blog Architecture Board" />
  
  <p>We also have full support for YouTube video embeds, perfect for technical tutorials:</p>
  <div data-youtube-video>
    <iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></iframe>
  </div>

  <h2>2. Rich Text & Formatting</h2>
  <p>Our editor supports <mark>color highlighting</mark> for emphasis. We can also handle scientific notations like H<sub>2</sub>O (subscript) or mathematical formulas like E = mc<sup>2</sup> (superscript).</p>
  
  <p>For developers, code blocks are essential:</p>
  <pre><code>// AWS Lambda Handler in TypeScript
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Lambda!" }),
  };
};</code></pre>

  <h2>3. Data Structures (Tables & Lists)</h2>
  <p>Below is a technical comparison table for our Serverless stack:</p>
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Purpose</th>
        <th>Pricing Tier</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>AWS Lambda</td>
        <td>Compute / Logic</td>
        <td>Free Tier (1M/mo)</td>
      </tr>
      <tr>
        <td>DynamoDB</td>
        <td>NoSQL Database</td>
        <td>On-Demand</td>
      </tr>
      <tr>
        <td>S3</td>
        <td>Static Assets</td>
        <td>Pay per GB</td>
      </tr>
    </tbody>
  </table>

  <ul>
    <li>Fully responsive bullet lists.</li>
    <li>Optimized for mobile reading.</li>
    <li>Styled via Tailwind Typography.</li>
  </ul>

  <p>Finally, we can even embed live Twitch streams for community events:</p>
  <div data-twitch-video>
    <iframe src="https://www.twitch.tv/lofigirl"></iframe>
  </div>
`,
    tags: ["general"],
  });

  // Protección de ruta
  if (!isAdmin) {
    return (
      <div className="p-20 text-center">You don't have access here 🙅‍♂️</div>
    );
  }

  const handleSubmit = async () => {
    try {
      // Validamos con Zod
      const validated = CreatePostSchema.parse(formData);

      // Aquí iría tu fetch a la Lambda...
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Validation error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">New Post</h1>

      <div className="space-y-4 mb-6">
        <input
          placeholder="Title"
          className="w-full p-3 border rounded"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          placeholder="slug-del-post"
          className="w-full p-3 border rounded"
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
      </div>

      <PostEditor
        content={formData.content}
        onChange={(html) => setFormData({ ...formData, content: html })}
      />

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
      >
        Publis your Post
      </button>
    </div>
  );
}
