import { redirect } from "next/navigation";
import { getActiveProfileId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profileId = await getActiveProfileId();
  redirect(profileId ? "/select" : "/profiles");
}
