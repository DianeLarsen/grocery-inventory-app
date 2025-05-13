import { auth } from "@clerk/nextjs/server";
import DashboardPage from "./dashboard/page";
import Link from "next/link";
import { LandingImage } from "@/components/LandingImage";

export default async function Home() {
  const { userId } = await auth(); // ✅ Await the auth call

  if (userId) {
    return <DashboardPage />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 text-center">
      
      <LandingImage />
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Grocery Inventory
      </h1>
      <p className="text-lg text-muted-foreground max-w-prose">
        Manage your groceries, track inventory, and discover recipes with ease.
      </p>
      <div className="flex gap-4 mt-6">
        <Link
          href="/sign-up"
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
        >
          Create Account
        </Link>
        <Link
          href="/sign-in"
          className="px-6 py-3 rounded-xl border border-input hover:bg-accent transition"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
