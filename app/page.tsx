import { redirect } from "next/navigation";
import { getActiveProfileId } from "@/lib/auth";

export default async function Home() {
  const profileId = await getActiveProfileId();
  redirect(profileId ? "/select" : "/login");
}
