import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Recipes</h1>
      <p className="text-muted-foreground">This is the recipes page.</p>
    </div>
  );
}
