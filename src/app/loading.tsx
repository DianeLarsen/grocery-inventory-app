import { Suspense } from "react";
import LoadingClient from "@/components/LoadingClient";

export default function LoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingClient />
    </Suspense>
  );
}