import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import TeacherWritingSample from "@/components/board/TeacherWritingSample";

export default async function TeacherWritingPage() {
  const user = await requireUser();
  if (!user) redirect("/login");
  return <TeacherWritingSample />;
}
