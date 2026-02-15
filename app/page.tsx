import Image from "next/image";
import SignUpPage from "./(auth)/signup/page";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SignUpPage></SignUpPage>
    </div>
  );
}
